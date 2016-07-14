import pymongo 
import sys
import time
from datetime import date, timedelta
from config import acquario

#Connect to the local  Server
connection = pymongo.MongoClient()
config_acq  =acquario()

DELTA = config_acq['getTemp']['Temp']['Delta Trace']

def getTemp( temp):
   
    print ("Da inserire temperatura : "+str(temp))
    #Connect to the Acquarium DataBase Collection "Sensors"
    db = connection.domotica.temperature

    month_year = time.strftime("%Y%m")
    local_day = time.strftime("%d")
    Periodo = {}
    giorno = {}
    sensore = {}
    tempList = []

    acq_temp = {
            "temp":float(temp),
            "DataPrimoInserimento":time.strftime("%d/%m/%Y")+" "+time.strftime("%X"),
            "DataUltimoAggiornamento":time.strftime("%d/%m/%Y")+" "+time.strftime("%X")
    };
    
    tempList.append(acq_temp)
    sensore['acquario'] = tempList
    giorno[local_day] = sensore
    Periodo[month_year] = giorno
    path = month_year+"."+local_day+".acquario"


    result = db.find({},{month_year:1})
    if(result.count() == 0):
        db.insert(Periodo)
    else:
        try:
            temp_read = float(  result[0][month_year][local_day]['acquario'][-1]['temp'])
        except:
            print("Lettura precedente non presente, inizzializzo a zero");
            temp_read=0.0
    
        print ("Ultima temperatura letta :"+str(temp_read))
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
            print("Vado ad aggiornare la data "+result[0][month_year][local_day]['acquario'][-1]['DataUltimoAggiornamento'])
            print("Con la data : "+acq_temp['DataUltimoAggiornamento'])
            print("Path di aggiornamento : "+path)
            db.update({
              "_id" : result[0]['_id'],path+'.DataUltimoAggiornamento':result[0][month_year][local_day]['acquario'][-1]['DataUltimoAggiornamento']
            },{
              '$set' : {
                path+'.$.DataUltimoAggiornamento' : acq_temp['DataUltimoAggiornamento']
                #Periodo[month_year][local_day]['acquario'][0]['Data Ultimo Aggiornamento']
              }
            })

    connection.close()



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


def getRain():
    db = connection.domotica.meteo
    yesterday = date.today() - timedelta(1)
    month_year = yesterday.strftime("%Y%m")
    local_day = yesterday.strftime("%d")
    path = month_year+"."+local_day

    result = db.find({},{path:1})
    array = result[0][month_year][local_day]

    print(path)
    mmRain = 0
    for ele in array:
        if len(ele['rain']) > 0:
            print(ele['rain'])
            mmRain += ele['rain']['1h']

    return(mmRain)



if __name__ == "__main__":
    #getTemp(sys.argv[1])
    logEvent(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    
