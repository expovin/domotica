#!/bin/sh
sleep 30
echo "Startup SensorStartUp" >> ./pushButtonControl.log
export PYTHONPATH=/home/pi/domotica
nohup /usr/bin/python /home/pi/domotica/SensoriAcquario/getTemp.py &

