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
from datetime import date, timedelta
from config import acquario
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
def getTemp( temp):

    logOut(4,FILE_NAME,"Temperatura da memorizzare "+str(temp)+" verifico il valore dell'ultima lettura")
   
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
            "DataPrimoInserimento":time.strftime("%d/%m/%Y")+" "+time.strftime("%X"),
            "DataUltimoAggiornamento":time.strftime("%d/%m/%Y")+" "+time.strftime("%X")
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
    logOut(4,FILE_NAME,"Verifico se esiste un documento per il periodo "+month_year)
    result = db.find({},{month_year:1})    
    if(result.count() == 0):
        logOut(3,FILE_NAME,"Documento non esistente, ne inserisco uno nuovo")
        db.insert(Periodo)
    else:
        logOut(3,FILE_NAME,"Documento esistente, vado in aggiunta")
        try:            
            temp_read = float(  result[0][month_year][local_day]['acquario'][-1]['temp'])
            logOut(3,FILE_NAME,"Leggo ultima lettura memorizzata nel periodo "+ str(temp_read))
        except:
            logOut(2,FILE_NAME,"Lettura precedente non presente, inizzializzo a zero")
            temp_read=0.0


        logOut(4,FILE_NAME,"Verifico che la temperatura superi il delta per la memorizzazione di un nuovo valore"+ str(temp_read))
        if (abs(float(temp) - temp_read) > float(DELTA)):
            print ("Temperatura variata, aggiungo nuova lettura! "+str(temp)+" : "+str(temp_read))
            db.update({
              "_id" : result[0]['_id'],
            },{
              '$push' : {
                path : Periodo[month_year][local_day]['acquario'][0]
              }
            },upsert=False)
        else:
            db.update({
              "_id" : result[0]['_id'],path+'.DataUltimoAggiornamento':result[0][month_year][local_day]['acquario'][-1]['DataUltimoAggiornamento']
            },{
              '$set' : {
                path+'.$.DataUltimoAggiornamento' : acq_temp['DataUltimoAggiornamento']
                #Periodo[month_year][local_day]['acquario'][0]['Data Ultimo Aggiornamento']
              }
            })

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


# Questa funzione restituisce il totale dei mm di pioggia caduti il giorno 
# precedente
def getRain():
    db = connection.domotica.meteo

    yesterday = date.today() - timedelta(1)    # Calcolo la giornata di ieri
    month_year = yesterday.strftime("%Y%m")    # Anno_Mese ieri
    local_day = yesterday.strftime("%d")       # Giorno di ieri
    path = month_year+"."+local_day
   
    logOut(4,FILE_NAME,"Recupero informazioni meteo per il giorno "+path) 
    try :
        result = db.find({},{path:1})
        array = result[0][month_year][local_day]
        mmRain = 0
        for ele in array:
            if len(ele['rain']) > 0:
                mmRain += ele['rain']['1h']
        logOut(3,FILE_NAME,"Pioggia caduta il "+path+" mm :"+str(mmRain))
 
    except KeyError:
        # Correzione errore 5. Nel caso non siano state raccolte informazioni meteo
        # nella giornata precedente, considero pioggia 0
        logOut(2,FILE_NAME,"Non ci sono informazioni meteo, considero no pioggia") 
        print("Non ci sono informazioni meteo, considero no pioggia")
        mmRain = 0         

    return(mmRain)



if __name__ == "__main__":
    #getTemp(sys.argv[1])
    logEvent(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    
