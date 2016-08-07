#!/bin/sh

#Interprete python da utilizzare
export PYTHONPATH=/home/pi/domotica


restart() {
  stop
  start
}

status() {
  echo "Not yet implemented"
}

skip() {
    echo "Zone skipping..."
    touch /home/pi/domotica/ImpiantoIrrigazione/skipZone.tmp  
}

stop() {
    echo "Process stopping..."
    touch /home/pi/domotica/ImpiantoIrrigazione/stop.tmp
}

start() {
    # code to start app comes here 

    #Data log da inviare
    echo "Process starting..."
    DATE=`date +%Y-%m-%d`

    /usr/bin/python /home/pi/domotica/ImpiantoIrrigazione/startCycle.py 1>/var/log/domotica/Irrigazione/Irrigazione_$DATE.log 2>&1 

    #Recupero il return code
    rc=$?

    echo $! > save_pid.txt

    case "$rc" in
       2) echo "Stop ciclo controllato"
          SUBJ="Ciclo fermato dall'utente"
          BODY="Il ciclo di irrigazione e' stato fermato dall'utente"
       ;;
       1) echo "Ha piovuto non innaffio"
          SUBJ="Irrigazione non partita per pioggia"
          BODY="Coclo irrigazione non partito perchè nella giorata di oeri è caduta sufficente pioggia, log in allegato"
       ;;
       0) echo "Tutto OK invio mail con log"
          SUBJ="INFO : Impianto Irrigazione Terminato correttamente"
          BODY="Ciclo impianto irrigazione terminato correttamente, log in allegato"
       ;;
       254) echo "WARN : Impianto irrigazione non partito"
           SUBJ="WARN : Impianto irrigazione non partito"
           BODY="Impianto di irrigazione non partito perche' non ha risposto durante i tentativi di contatto"
      
       ;;
       253) echo "Errore durante invio comando"
           SUBJ="WARN : Errore durante l'invio di un comando alla scheda Realy, impianto fermato"
           BODY="La scheda non ha recepito un comando, il ciclo di irrigazione e' stato correttamente terminato"
       ;;

       252) echo "Errore Tolta corrente perche' scheda non raggiungibile"
           SUBJ="ERROR: Tolta corrente all'impianto ciclo fermato"
           BODY="E' stata tolta la corrente all'impianto di irrigazione perche' la scheda non ha risposto ai tentativi di contatto durante il ciclo di irrigazione"

       ;;
       252) echo "Errore Grave non risponde BT004"
           SUBJ="FATAL : Non e' stato possibile togliere la corrente all'impianto di irrigazione"
           BODY="La scheda non ha risposto nei tempi durante il ciclo di irrigazione, si e' tentato un arresto forzato togliendo la corrente, ma il Relay BT004 non ha risposto"
       ;;
    esac

    /usr/bin/python /home/pi/domotica/common/logAction.py "$SUBJ" "$BODY" "Irrigazione" 

}



case "$1" in 
    start)
       start
       ;;
    stop)
       stop
       ;;
    skip)
       skip
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
       echo "Usage: $0 {start|stop|skip|status|restart}"
esac

exit 0 