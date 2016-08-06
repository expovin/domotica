#!/bin/sh
export PYTHONPATH=/home/pi/domotica

#Data log da inviare
DATE=`date +%Y-%m-%d`

nohup /usr/bin/python /home/pi/domotica/ImpiantoIrrigazione/getWeatherCondition.py 1>/var/log/domotica/Irrigazione/getWeather_$DATE.log 2>&1 &

