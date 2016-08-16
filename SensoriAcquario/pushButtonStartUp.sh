#! /bin/sh
export PYTHONPATH=/home/pi/domotica

start() {
	#Data log da inviare
	echo "Service starting ..."
	DATE=`date +%Y-%m-%d`
	nohup /usr/bin/python /home/pi/domotica/SensoriAcquario/pushButtonControl.py 1>/var/log/domotica/SensoriAcquario/pushButton_$DATE.log 2>&1 &
	/home/pi/domotica/SensoriAcquario/LightOFF.sh
}

stop() {
	echo "Service Stopping"
	touch /home/pi/domotica/SensoriAcquario/stopPushButton.tmp
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