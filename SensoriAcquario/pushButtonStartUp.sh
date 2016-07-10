#! /bin/sh
sleep 300
export PYTHONPATH=/home/pi/domotica
echo "Startup pushButtonControl" >> ./pushButtonControl.log
nohup python /home/pi/domotica/SensoriAcquario/pushButtonControl.py &
/home/pi/domotica/SensoriAcquario/LightOFF.sh
