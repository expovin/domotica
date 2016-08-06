################################################################################
# getWeatherCondition                                                          #
#                                                                              #
# Questa funzione sfrutta i servizi di OpenWeatherMap (OWM) per prelevare      #
# informazioni sullo stato attuale del meteo a Grezzago. Le condizioni meteo   #
# vengono salvate ogni ora su db nella collection meteo                        #
#                                                                              #
################################################################################

from pymongo import MongoClient
import pyowm
import time
from datetime import datetime
from common.config import weather
from common.logAction import *
from os import path

config_weather = weather()

FILE_NAME=path.basename(__file__)
OWN_KEY = config_weather['OWM KEY']
LOCATION = config_weather['Place']


owm = pyowm.OWM(OWN_KEY)
client = MongoClient()

db = client.domotica.meteo

logOut(3,FILE_NAME,"Processo raccolta informazioni meteo partito")
while True:    
    
    try:
        observation = owm.weather_at_place(LOCATION)
        w = observation.get_weather()
        t = observation.get_reception_time(timeformat='iso') 

        ref_time = w.get_reference_time(timeformat='iso')
        ref_time_ux = w.get_reference_time()
        status = w.get_status()
        det_status = w.get_detailed_status() 
        weather_code = w.get_weather_code()
        sunrise_time = w.get_sunrise_time() 
        sunset_time = w.get_sunset_time() 
        wind = w.get_wind()
        humidity = w.get_humidity()
        rain = w.get_rain()
        temp = w.get_temperature('celsius')
        snow = w.get_snow() 
        pressure = w.get_pressure()

        month_year = time.strftime("%Y%m", time.localtime(ref_time_ux))
        local_day = time.strftime("%d", time.localtime(ref_time_ux))
        local_date = time.strftime("%D", time.localtime(ref_time_ux))
        local_time = time.strftime("%H:%M", time.localtime(ref_time_ux))

        local_sunrise_time = time.strftime("%H:%M", time.localtime(sunrise_time))
        local_sunset_time  = time.strftime("%H:%M", time.localtime(sunset_time))



        weather = {
                'date' : local_date,
                'time' : local_time,
                'status' : status,
                'temp' : temp,
                'pressure' : pressure,
                'det_status' : det_status,
                'weather_code' : weather_code,
                'sunrise_time' : local_sunrise_time,
                'sunset_time' : local_sunset_time,
                'wind' : wind,
                'humidity' : humidity,
                'rain' : rain,
                'snow': snow
        }


       #Check if the document MONTH_YEAR exist on mongodb
        Periodo = {}
        giorno = {} 
        dettaglio_orario = []
        kdett = {}
        giorni = []
        kgiorni = {}
        dettaglio_orario.append(weather)
        giorno[local_day] = dettaglio_orario 
        Periodo[month_year] = giorno
        path = month_year+"."+local_day 

        result = db.find({},{"Jul 2016":1})    
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

        time.sleep(60*60)

    except AttributeError as Attr:
        logOut(2,FILE_NAME,"ATTENZIONE, errore observation data not available "+str(Attr))
        time.sleep(60*60)

    except:
        logOut(2,FILE_NAME,"ATTENZIONE, non sono riuscito a recuperare le informazioni meteo, ritento al prossimo ciclo ")
        time.sleep(60*60)