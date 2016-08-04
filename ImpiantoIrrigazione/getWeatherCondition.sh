#!/bin/sh
export PYTHONPATH=/home/pi/domotica
sleep 30
nohup /usr/bin/python /home/pi/domotica/ImpiantoIrrigazione/getWeatherCondition.py &

