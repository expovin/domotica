#!/bin/sh
export PYTHONPATH=/home/pi/domotica
<<<<<<< HEAD
=======

#Data log da inviare
DATE=`date +%Y-%m-%d`

nohup /usr/bin/python /home/pi/domotica/ImpiantoIrrigazione/getWeatherCondition.py 1>/var/log/domotica/Irrigazione/getWeather_$DATE.log 2>&1 &
>>>>>>> 9760522bad10f38b132b6f0d2943f2a647e785af


start() {
	#Data log da inviare
	echo "Service starting ..."
	DATE=`date +%Y-%m-%d`
	nohup /usr/bin/python /home/pi/domotica/ImpiantoIrrigazione/getWeatherCondition.py 1>/var/log/domotica/Irrigazione/getWeather_$DATE.log 2>&1 &
}

stop() {
	echo "Service Stopping"
	touch /home/pi/domotica/ImpiantoIrrigazione/stopWeatherCondition.tmp
}





case "$1" in 
    start)
       start
       ;;
    stop)
       stop
       ;;
    restart)
       stop
       start
       ;;
    status)
       # code to check status of app comes here 
       # example: status program_name
       ;;
    *)
       echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 