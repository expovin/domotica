################################################################################
# MongoDbHandler.py                                                            #
#                                                                              #
# Questa funzione gestisce le interfaccie di comunicazione verso il repository #
# per (quasi) tutti i moduli.                                                  #
#                                                                              #
################################################################################

import pymongo 
import sys
import time
from datetime import date, timedelta, datetime
from config import acquario,irrigazione
from logAction import *
from os import path

FILE_NAME=path.basename(__file__)

connection = pymongo.MongoClient()    # Connect to the local  Server
config_acq  =acquario()               # Lettura configurazione acquario

# Questa e la temperatura entro la quale non viene considerata rilevante una
# variazione di temperatura, quindi non viene tracciata. Vengono tracciate solo
# le temperature che differiscono di DELTA dalla precedente.
# Questo parametro viene letto solo allo start del modulo
DELTA = config_acq['getTemp']['Temp']['Delta Trace']

# Questa funzione si occupa di tracciare la temperatura nel DB solo se supera
# DELTA altrimenti si limita ad aggiornare la data di ultimo update
def recordTemp( temp):

    logOut(4,FILE_NAME,"Temperatura da memorizzare "+str(temp)+" verifico il " \
     "valore dell'ultima lettura")
   
    #Connect to the Acquarium DataBase Collection "Sensors"
    db = connection.domotica.temperature

    month_year = time.strftime("%Y%m")    # Anno Mese attuale
    local_day = time.strftime("%d")       # Giorno attuale in CET
    Periodo = {}                          # Root Document (Periodo)
    giorno = {}                           # Giorno del mese
    sensore = {}                          # Sensore letto
    tempList = []                         # Array di temperature lette

    # Documento da memorizzare
    acq_temp = {
            "temp":float(temp),
            "DataPrimoInserimento":time.strftime("%d/%m/%Y")+" " \
                 +time.strftime("%X"),
            "DataUltimoAggiornamento":time.strftime("%d/%m/%Y")+" " \
                 +time.strftime("%X")
    };
    logOut(4,FILE_NAME,"Documento da memorizzare "+str(acq_temp))
    
    tempList.append(acq_temp)
    sensore['acquario'] = tempList
    giorno[local_day] = sensore
    Periodo[month_year] = giorno
    path = month_year+"."+local_day+".acquario"

    logOut(4,FILE_NAME,"Path di memorizzazione "+path)

    # Verifico se il documento del periodo corrente gia esiste per inserirlo o
    # modificarlo
    logOut(4,FILE_NAME,"Verifico se esiste un documento per il periodo " \
        +month_year)
    result = db.find({},{month_year:1})    
    if(result.count() == 0):
        logOut(3,FILE_NAME,"Documento non esistente, ne inserisco uno nuovo")
        db.insert(Periodo)
    else:
        logOut(3,FILE_NAME,"Documento esistente, vado in aggiunta")
        try:            
            temp_read = float(  result[0][month_year][local_day]['acquario'][-1]['temp'])
            logOut(3,FILE_NAME,"Leggo ultima lettura memorizzata nel periodo " \
                + str(temp_read))
        except:
            logOut(2,FILE_NAME,"Lettura precedente non presente," \
                " inizzializzo a zero")
            temp_read=0.0


        logOut(4,FILE_NAME,"Verifico che la temperatura superi il delta per la" \
            " memorizzazione di un nuovo valore"+ str(temp_read))
        if (abs(float(temp) - temp_read) > float(DELTA)):
            print ("Temperatura variata, aggiungo nuova lettura! " \
                +str(temp)+" : "+str(temp_read))
            db.update({
              "_id" : result[0]['_id'],
            },{
              '$push' : {
                path : Periodo[month_year][local_day]['acquario'][0]
              }
            },upsert=False)
        else:
            db.update({
              "_id" : result[0]['_id'],path+'.DataUltimoAggiornamento': \
              result[0][month_year][local_day]['acquario'][-1]['DataUltimoAggiornamento']
            },{
              '$set' : {
                path+'.$.DataUltimoAggiornamento' : acq_temp['DataUltimoAggiornamento']
              }
            })

    connection.close()


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
    path = month_year+"."+local_day


    event = {
        "date" : time.strftime("%d/%m/%Y")+" "+time.strftime("%X"),
        "level" : level,
        "module" : module,
        "action" : action,
        "message" : message
    }
 
    events.append(event)
    giorno[local_day] = events
    Periodo[month_year] = giorno
    
    result = db.find({},{month_year:1})
    if(result.count() == 0):
        db.insert(Periodo)
    else:
        db.update({
          "_id" : result[0]['_id'],
        },{
          '$push' : {
            path : Periodo[month_year][local_day][0]
          }
        },upsert=False)


    connection.close()


# Questa funzione restituisce il totale dei mm di pioggia caduti il nDay 
# precedenti
def getRain(nDay):
    db = connection.domotica.meteo

    yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
    month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
    local_day = yesterday.strftime("%d")       # Giorno di ieri
    path = month_year+"."+local_day
   
    logOut(4,FILE_NAME,"Recupero informazioni meteo <Pioggia> per il giorno "+path) 
    try :
        result = db.find({},{path:1})
        array = result[0][month_year][local_day]
        mmRain = 0
        for ele in array:
            if len(ele['rain']) > 0:
                mmRain += ele['rain']['1h']
                logOut(5,FILE_NAME,"Pioggia per elemento  "+str(ele['time'])+" : "+str(ele['rain']['1h']))

        logOut(3,FILE_NAME,"Pioggia caduta il "+path+" mm :"+str(mmRain))
 
    except KeyError:
        # Correzione errore 5. Nel caso non siano state raccolte informazioni meteo
        # nella giornata precedente, considero pioggia 0
        logOut(2,FILE_NAME,"Non ci sono informazioni meteo, considero no pioggia") 
        mmRain = 0         

    connection.close()
    return(mmRain)


# Questa funzione restituisce la media del vento nDay precedenti ad oggi

def getWind(nDay):
    db = connection.domotica.meteo

    yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
    month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
    local_day = yesterday.strftime("%d")       # Giorno di ieri
    path = month_year+"."+local_day

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

def getTemp(nDay):
    db = connection.domotica.meteo
    config_Irg  = irrigazione()               # Lettura configurazione irrigazione

    # Lettura dal db di configurazione del'OFFSET di alba e tramonto per il 
    # calcolo della temperatura nelle sole ore diurne
    OFFSET_ALBA = config_Irg['PolicyIrrigazione']['03']['OffsetAlbaOre']
    OFFSET_TRAMONTO = config_Irg['PolicyIrrigazione']['03']['OffsetTramontoOre']

    yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
    month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
    local_day = yesterday.strftime("%d")       # Giorno di ieri
    path = month_year+"."+local_day

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

def getIrrigatedWater(nDay,zona):
    totIrrigatedWater = 0.0
    db = connection.domotica.irrigazione

    yesterday = date.today() - timedelta(nDay) # Calcolo la giornata nDay fa
    month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
    local_day = yesterday.strftime("%d")       # Giorno di ieri
    path = month_year+"."+local_day

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

def getAvgTempNDays(nDays):
    avgTemp = []
    #totTemp = 0.0    

    for day in range(nDays):
        avgTemp.append(getTemp(day))

    logOut(3,FILE_NAME,"Temperatura media per gli ultimi "+\
        str(nDays)+" giorni :"+str(avgTemp))

    return avgTemp


# Questa funzione restituisce in uscita il vento media calcolata sugli 
# ultimi nDays ricevuti come parametro. Il vento medio e calcolata nelle 24h
# degli nDays precedenti

def getAvgWindDays(nDays):
    avgWind = []

    for day in range(nDays):
        avgWind.append(getWind(day))

    logOut(3,FILE_NAME,"Vento medio per gli ultimi "+str(nDays)+" giorni :"\
        +str(avgWind))

    return avgWind

# Questa funzione richiama piu volte getRain sulle nDays precedenti e 
# restituisce il totale dei mm di pioggia caduti negli ultimi giorni

def getTotalRainDays(nDays):
    totRain = []

    for day in range(nDays):
        totRain.append(getRain(day))

    logOut(3,FILE_NAME,"Pioggia totale negli ultimi "+str(nDays)+" giorni :"\
        +str(totRain))

    return totRain

# Questa funzione restituisce il totale dell'acqua irrigata negli nDays 
# precedenti, leggendola da db

def getTotalIrrigatedWater(nDays, zona):
    totalIrrigatedWater = []

    for day in range(nDays):
        totalIrrigatedWater.append(getIrrigatedWater(day,zona))

    return totalIrrigatedWater


if __name__ == "__main__":
    #getTemp(sys.argv[1])
    logEvent(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    
