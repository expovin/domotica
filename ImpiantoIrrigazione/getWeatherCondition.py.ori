from pymongo import MongoClient
import pyowm
import time
from datetime import datetime

owm = pyowm.OWM('4dbcc04a35845437037427248c4a9446')
client = MongoClient()

db = client.domotica.meteo


while True:
	
	observation = owm.weather_at_place('Grezzago,it')
	w = observation.get_weather()
	t = observation.get_reception_time(timeformat='iso') 

	print ("Prelevo condizioni del tempo "+str(t))
	ref_time = w.get_reference_time(timeformat='iso')
        ref_time_ux = w.get_reference_time()
	status = w.get_status()
	det_status = w.get_detailed_status() 
	weather_code = w.get_weather_code()
	sunrise_time = w.get_sunrise_time('iso') 
	sunset_time = w.get_sunset_time('iso') 
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



        weather = {
                'date' : local_date,
                'time' : local_time,
                'status' : status,
                'temp' : temp,
                'pressure' : pressure,
                'det_status' : det_status,
                'weather_code' : weather_code,
                'sunrise_time' : sunrise_time,
                'sunset_time' : sunset_time,
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
        #kdett['dettaglio orario'] = dettaglio_orario
        giorno[local_day] = dettaglio_orario 
        #giorni.append(giorno)
        #kgiorni['Giorni'] = giorni
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
#        time.sleep(20)

