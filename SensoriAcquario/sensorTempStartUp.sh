#!/bin/sh
export PYTHONPATH=/home/pi/domotica

start() {
	echo "Service starting ..."
	DATE=`date +%Y-%m-%d`
	nohup /usr/bin/python /home/pi/domotica/SensoriAcquario/getTemp.py 1>/var/log/domotica/SensoriAcquario/geTemp_$DATE.log 2>&1 &
}

stop() {
	echo "Service Stopping"
	touch /home/pi/domotica/SensoriAcquario/stopGetTemp.tmp
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