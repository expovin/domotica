################################################################################
# MongoDbHandler.py                                                            #
#                                                                              #
# Questa funzione gestisce le interfaccie di comunicazione verso il repository #
# per (quasi) tutti i moduli.                                                  #
#                                                                              #
################################################################################

import pymongo 
from bson.objectid import ObjectId
import sys
import time
from datetime import date, timedelta, datetime
from config import *
from logAction import *
from os import path

FILE_NAME=path.basename(__file__)


connection = pymongo.MongoClient()    # Connect to the local  Server
config_acq = acquario()               # Lettura configurazione acquario
config_gen = general()                # Lettura configurazione sezione General

# Questa e la temperatura entro la quale non viene considerata rilevante una
# variazione di temperatura, quindi non viene tracciata. Vengono tracciate solo
# le temperature che differiscono di DELTA dalla precedente.
# Questo parametro viene letto solo allo start del modulo


# Questa funzione si occupa di tracciare la temperatura nel DB solo se supera
# DELTA altrimenti si limita ad aggiornare la data di ultimo update
def tracciaLettura(lettura,IDSensore):

    logOut(4,FILE_NAME,"Temperatura da memorizzare "+str(lettura)+" verifico il " \
     "valore dell'ultima lettura")
   
    #Connect to the Acquarium DataBase Collection "Sensors"
    db = connection.domotica.LettureSensori
    dbs = connection.domotica.Sensori 

    s = dbs.find_one({"_id" : ObjectId(IDSensore)})
    if 'DeltaVariazioneTraccia' in s:
        DELTA = s['DeltaVariazioneTraccia']
        logOut(5,FILE_NAME,"Letto valore di DELTA locale "+str(DELTA) )
    else:
        DELTA = config_gen['DeltaVariazioneTraccia']
        logOut(5,FILE_NAME,"Valore di DELTA locale non presente, uso il default "\
            +str(DELTA) )


    month_year = time.strftime("%Y%m")    # Anno Mese attuale
    local_day = time.strftime("%d")       # Giorno attuale in CET
    Periodo = {}                          # Root Document (Periodo)
    Doc = {}                           # Giorno del mese
    Letture = {}                          # Sensore letto
    tempList = []                         # Array di temperature lette

    # Documento da memorizzare
    acq_temp = {
            "lettura":float(lettura),
            "DataPrimoInserimento":time.strftime("%d/%m/%Y")+" " \
                 +time.strftime("%X"),
            "DataUltimoAggiornamento":time.strftime("%d/%m/%Y")+" " \
                 +time.strftime("%X"),
			"idSensore" : IDSensore
    };
    logOut(4,FILE_NAME,"Documento da memorizzare "+str(acq_temp))
    
    tempList.append(acq_temp)
    Doc = {
        'Periodo' : month_year,
        'Letture' : tempList
    }
    path = month_year

    logOut(4,FILE_NAME,"Path di memorizzazione "+path)

    # Verifico se il documento del periodo corrente gia esiste per inserirlo o
    # modificarlo
    logOut(4,FILE_NAME,"Verifico se esiste un documento per il periodo " +month_year)
    result = db.find_one({'Periodo' : month_year})    
    if type(result) is not dict:
        logOut(3,FILE_NAME,"Documento non esistente, ne inserisco uno nuovo")
        db.insert(Doc)
    else:
        
        _id=result['_id']
        

        logOut(3,FILE_NAME,"Documento esistente "+str(_id)+" vado in aggiunta")
        logOut(3,FILE_NAME,"Recupero l'ultima lettura effettuata con : "\
            +IDSensore)

        result = db.aggregate([
            {'$match' : {'Periodo' : month_year}},
            {'$unwind' : "$Letture"},
            {'$match' : {'Letture.idSensore':IDSensore}},
            {'$sort' : {'Letture.DataUltimoAggiornamento' : -1}},
            {'$limit' : 1}
        ])

        for i in result:
            l = {}
            l=i['Letture']

        try:            
            last_read = float(l['lettura'])
            lastModDate = l['DataUltimoAggiornamento']

            logOut(4,FILE_NAME,"Leggo ultima lettura memorizzata " +\
                str(last_read)+ " Data ultimo aggiornamento "+str(lastModDate))
        except:
            logOut(2,FILE_NAME,"Lettura precedente non presente," \
                " inizzializzo a zero")
            last_read=0.0


        logOut(4,FILE_NAME,"Verifico che la temperatura "+str(lettura)+
            " superi il delta "+str(DELTA)+" per la" \
            " memorizzazione di un nuovo valore"+ str(last_read))
        if (abs(float(lettura) - float(last_read)) > float(DELTA)):
            logOut(4,FILE_NAME,"Temperatura variata, aggiungo nuova lettura! " \
                +str(lettura)+" : "+str(last_read))            
            db.update({
              "_id" : _id,  
            },{
              '$push' : {
                'Letture' : acq_temp
              }
            },upsert=False)

        else:
            logOut(4,FILE_NAME,"Temperatura nei range, aggiorno data ultima lettura " \
                +str(lettura)+" : "+str(last_read)+" "+str(acq_temp['DataUltimoAggiornamento']))

            db.update({
              "_id" : _id,'Letture.DataUltimoAggiornamento': lastModDate
            },{
              '$set' : {
                'Letture.$.DataUltimoAggiornamento' : acq_temp['DataUltimoAggiornamento']
              }
            })

    #connection.close()

def recordLettura(lettura,IDSensore):

    db = connection.domotica.Sensori

    logOut(3,FILE_NAME,"Aggiornamento lettura per sensore "+str(IDSensore)+" a : "+str(lettura))


    db.update({
        "_id" : ObjectId(IDSensore)
        },{
          '$set' : {
              'ultimaLettura' : lettura,
              "dataUltimoAggiornamento": datetime.utcnow()
          }
    },upsert=True)

    result = db.find_one({'_id' : ObjectId(IDSensore)})
    if(result['TracciaStoria']):
        logOut(3,FILE_NAME,"Abilitata tracciatura per il sensore "+str(IDSensore)+" registro : "+str(lettura))
        tracciaLettura(lettura,IDSensore)




# Questa funzione si occupa di scrivere nel DB l'acqua effettivamente irrigata
# per la zona di competenza

def recordIrrigatedWater(Acqua, zona, sec):
    logOut(4,FILE_NAME,"Memorizzo in DB per la zona "+zona+" Acqua irrigata:"\
        +str(Acqua))

    #Connect to the Acquarium DataBase Collection "Sensors"
    db = connection.domotica.irrigazione

    month_year = time.strftime("%Y%m")           # Anno Mese attuale
    local_day = time.strftime("%d")              # Giorno attuale in CET
    local_time = time.strftime("%H:%M:%S")       # Giorno attuale in CET
    docZona = {}
    Periodo = {}
    giorno = {}

    startAt = datetime.strptime(local_time,"%H:%M:%S") - timedelta(seconds=sec)

     # Documento da memorizzare
    docZona[zona] = {
        "StartAt" : startAt.strftime("%H:%M:%S"),
        "EndAt" : local_time,
        "Irrigated" : Acqua
    }

    logOut(4,FILE_NAME,"Documento da memorizzare "+str(docZona))

    giorno[local_day] = docZona
    Periodo[month_year] = giorno
    path = month_year+"."+local_day+"."+zona
    pathUpdAcq = path+".Irrigated"
    pathUpdStr = path+".StartAt"
    pathUpdEnd = path+".EndAt"


    logOut(4,FILE_NAME,"Path di memorizzazione "+path)
    logOut(4,FILE_NAME,"Documento da aggiungere "+str(Periodo[month_year][local_day][zona]))

    result = db.find({},{month_year:1})    
    if(result.count() == 0):
        logOut(3,FILE_NAME,"Documento non esistente, ne inserisco uno nuovo")
        db.insert(Periodo)
    else:
        logOut(3,FILE_NAME,"Documento esistente, vado in aggiunta")
        try : 
            Irrigato = result[0][month_year][local_day][zona]['Irrigated']
            logOut(3,FILE_NAME,"Questa zona oggi ha gia ricevuto "+str(Irrigato)\
                +" litri. Vado in aggiunta")
            db.update({
              "_id" : result[0]['_id'],
            },{
              '$set' : {
                pathUpdStr : startAt.strftime("%H:%M:%S"),
                pathUpdAcq : Acqua + Irrigato,
                pathUpdEnd : local_time
              }
            },upsert=False)

        except KeyError:
            db.update({
              "_id" : result[0]['_id'],
            },{
              '$set' : {
                path : Periodo[month_year][local_day][zona]
              }
            },upsert=False)
            logOut(3,FILE_NAME,"Non presente irrigazione, inserisco nuovo documento")



    connection.close()

# Questa funzione si occupa di tracciare gli eventi di sistema sul DB
# suddividendoli per periodo (ANNO_MESE)
def logEvent(level, module, action, message):

    #Connect to acquarium DataBase Events Collection
    db = connection.domotica.eventi

    month_year = time.strftime("%Y%m")
    local_day = time.strftime("%d")
    Periodo = {}
    giorno = {}
    events = []
    path = month_year+local_day


    event = {
        "date" : time.strftime("%d/%m/%Y")+" "+time.strftime("%X"),
        "level" : level,
        "module" : module,
        "action" : action,
        "message" : message
    }
 
    events.append(event)
    #giorno[local_day] = events
    Periodo = {
        "Periodo" : path,   
        "Eventi" : events
    }
    
    result = db.find({"Periodo":path})
    if(result.count() == 0):
        db.insert(Periodo)
    else:
        db.update({
          "_id" : result[0]['_id'],
        },{
          '$push' : {
            "Eventi" : event  
          }
        },upsert=False)


    connection.close()


# Questa funzione restituisce il totale dei mm di pioggia caduti il nDay 
# precedenti
def getRain(nDay,dbgPath = None):
    db = connection.domotica.meteo

    if(dbgPath == None):
        yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
        month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
        local_day = yesterday.strftime("%d")       # Giorno di ieri
        path = month_year+"."+local_day
    else:
        path = dbgPath
        month_year, local_day = path.split(".")
   
    logOut(4,FILE_NAME,"Recupero informazioni meteo <Pioggia> per il giorno "+path) 
    try :
        result = db.find({},{path:1})
        array = result[0][month_year][local_day]
        mmRain = 0
        for ele in array:
            if '1h' in ele['rain']:
                mmRain += ele['rain']['1h']
                logOut(5,FILE_NAME,"Pioggia 1h per elemento  "+str(ele['time'])+" : "+str(ele['rain']['1h']))
            if '3h' in ele['rain']:
                mmRain += ele['rain']['3h']
                logOut(5,FILE_NAME,"Pioggia 3h per elemento  "+str(ele['time'])+" : "+str(ele['rain']['3h']))

        logOut(3,FILE_NAME,"Pioggia caduta il "+path+" mm :"+str(mmRain))
 
    except KeyError, err:
        # Correzione errore 5. Nel caso non siano state raccolte informazioni meteo
        # nella giornata precedente, considero pioggia 0
        logOut(2,FILE_NAME,"Non ci sono informazioni meteo, considero no pioggia. Errore :"+str(err)) 
        mmRain = 0         

    connection.close()
    return(mmRain)


# Questa funzione restituisce la media del vento nDay precedenti ad oggi

def getWind(nDay,dbgPath = None):
    db = connection.domotica.meteo

    if(dbgPath == None):
        yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
        month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
        local_day = yesterday.strftime("%d")       # Giorno di ieri
        path = month_year+"."+local_day
    else:
        path = dbgPath
        month_year, local_day = path.split(".")

    logOut(4,FILE_NAME,"Recupero informazioni meteo <Vento> per il giorno "+path) 
    try :
        result = db.find({},{path:1})
        array = result[0][month_year][local_day]
        wind = 0.0
        for ele in array:
            if len(ele['wind']) > 0:
                wind += ele['wind']['speed']
                logOut(5,FILE_NAME,"Vento per elemento  "+str(ele['time'])+" : "+str(ele['wind']['speed'])) 

        avgWind = wind/len(array)
        logOut(3,FILE_NAME,"Vento medio per il giorno "+path+" :"+str(avgWind))
 
    except KeyError:
        # Correzione errore 5. Nel caso non siano state raccolte informazioni meteo
        # nella giornata precedente, considero pioggia 0
        logOut(2,FILE_NAME,"Non ci sono informazioni meteo, considero no vento") 
        avgWind = 0         

    connection.close()
    return(avgWind)


# Questa funzione restituisce la media della temperatura nDay precedenti ad oggi
# il calcolo della temperatura viene fatto x ore dopo l'alba e y ore prima del
# tramonto

def getTemp(nDay,dbgPath = None):
    db = connection.domotica.meteo
    config_Irg  = irrigazione()               # Lettura configurazione irrigazione

    # Lettura dal db di configurazione del'OFFSET di alba e tramonto per il 
    # calcolo della temperatura nelle sole ore diurne
    OFFSET_ALBA = config_Irg['PolicyIrrigazione']['03']['OffsetAlbaOre']
    OFFSET_TRAMONTO = config_Irg['PolicyIrrigazione']['03']['OffsetTramontoOre']

    if(dbgPath == None):
        yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
        month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
        local_day = yesterday.strftime("%d")       # Giorno di ieri
        path = month_year+"."+local_day
    else:
        path = dbgPath
        month_year, local_day = path.split(".")


    logOut(4,FILE_NAME,"Recupero informazioni meteo <Temperatura> per il giorno "\
        +path) 
    try :
        result = db.find({},{path:1})
        array = result[0][month_year][local_day]
        temp = 0.0
        numEle = 0
        for ele in array:
            logOut(5,FILE_NAME,"Lettura elemento "+\
                str(ele['time'])+" : "+str(ele['temp']['temp']))     
            if (len(ele['temp']) > 0):

                # Calcolo gli oggetti time per il currenti time sunrise e sunset
                # letti dal Database. Per il sunrise e sunset aggiungo gli OFFSET
                # Trovati nel Db
                obj_time = datetime.strptime(ele['time'],'%H:%M')
                obj_sunrise_time = datetime.strptime(ele['sunrise_time'],'%H:%M') \
                    + timedelta(hours=OFFSET_ALBA)
                obj_sunset_time = datetime.strptime(ele['sunset_time'],'%H:%M') \
                    -  timedelta(hours=OFFSET_TRAMONTO)
                #################################################################

                if(obj_time > obj_sunrise_time) and (obj_time < obj_sunset_time):
                    temp += ele['temp']['temp']
                    numEle +=1
                    logOut(5,FILE_NAME,"Temperatura per elemento  "\
                        +str(ele['time'])+" : "+str(ele['temp']['temp'])) 

        avgTemp = temp/numEle
        logOut(3,FILE_NAME,"Temperatura media per il giorno "+path+" :"+str(avgTemp))
 
    except KeyError as err:
        # Correzione errore 5. Nel caso non siano state raccolte informazioni meteo
        # nella giornata precedente, considero pioggia 0
        logOut(2,FILE_NAME,"Non ci sono informazioni meteo, considero no temp"+str(err)) 
        avgTemp = 0         

    connection.close()
    return(avgTemp)

# Questa funzione restituisce 

def getIrrigatedWater(nDay,zona,dbgPath = None):
    totIrrigatedWater = 0.0
    db = connection.domotica.irrigazione

    if(dbgPath == None):
        yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
        month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
        local_day = yesterday.strftime("%d")       # Giorno di ieri
        path = month_year+"."+local_day
    else:
        path = dbgPath
        month_year, local_day = path.split(".")

    logOut(4,FILE_NAME,"Recupero informazioni irrigazione per il giorno "+path) 
    try :
        result = db.find({},{path:1})
        array = result[0][month_year][local_day]
        totIrrigatedWater += array[zona]['Irrigated']
        logOut(5,FILE_NAME,"Irrigazione per zona  "+str(zona)+" : "\
            +str(array[zona]['Irrigated'])) 

 
    except KeyError as err:
        # Correzione errore 5. Nel caso non siano state raccolte informazioni meteo
        # nella giornata precedente, considero pioggia 0
        logOut(2,FILE_NAME,"Errore KeyError "+str(err)+" considero irrigazione nulla") 
        totIrrigatedWater = 0         

    connection.close()
    return totIrrigatedWater


# Questa funzione restituisce in uscita la temperatura media calcolata sugli 
# ultimi nDays ricevuti come parametro. La temperatura media e calcolata tra un
# offset di ore dopo l'alba e prima del tramonto, specificato nel db config

def getAvgTempNDays(nDays,offset=0):
    avgTemp = []

    for day in range(nDays):
        avgTemp.append(getTemp(day+1+offset))

    logOut(3,FILE_NAME,"Temperatura media per gli ultimi "+\
        str(nDays)+" giorni :"+str(avgTemp))

    return avgTemp


# Questa funzione restituisce in uscita il vento media calcolata sugli 
# ultimi nDays ricevuti come parametro. Il vento medio e calcolata nelle 24h
# degli nDays precedenti

def getAvgWindDays(nDays,offset=0):
    avgWind = []

    for day in range(nDays):
        avgWind.append(getWind(day+1+offset))

    logOut(3,FILE_NAME,"Vento medio per gli ultimi "+str(nDays)+" giorni :"\
        +str(avgWind))

    return avgWind

# Questa funzione richiama piu volte getRain sulle nDays precedenti e 
# restituisce il totale dei mm di pioggia caduti negli ultimi giorni

def getTotalRainDays(nDays,offset=0):
    totRain = []

    for day in range(nDays):
        totRain.append(getRain(day+1+offset))

    logOut(3,FILE_NAME,"Pioggia totale negli ultimi "+str(nDays)+" giorni :"\
        +str(totRain))

    return totRain

# Questa funzione restituisce il totale dell'acqua irrigata negli nDays 
# precedenti, leggendola da db

def getTotalIrrigatedWater(nDays, zona, offset=0):
    totalIrrigatedWater = []

    for day in range(nDays+1):
        totalIrrigatedWater.append(getIrrigatedWater(day+offset,zona))

    return totalIrrigatedWater


if __name__ == "__main__":
    #getTemp(sys.argv[1])
    logEvent(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    
