python test.py 

rc=$? 
echo $rc
case "$rc" in

   1) echo "Ha piovuto non innaffio";
      SUBJ="Irrigazione non partita per pioggia";
      BODY="Coclo irrigazione non partito perchè nella giorata di oeri è caduta sufficente pioggia, log in allegato"
   ;;
   0) echo "Tutto OK invio mail con log"
      SUBJ="INFO : Impianto Irrigazione Terminato correttamente"
      BODY="Ciclo impianto irrigazione terminato correttamente, log in allegato"
   ;;
   -1) echo "WARN : Impianto irrigazione non partito"
       SUBJ="WARN : Impianto irrigazione non partito"
       BODY="Impianto di irrigazione non partito perche' non ha risposto durante i tentativi di contatto"

   ;;
   -2) echo "Errore durante invio comando"
       SUBJ="WARN : Errore durante l'invio di un comando alla scheda Realy, impianto fermato"
       BODY="La scheda non ha recepito un comando, il ciclo di irrigazione e' stato correttamente terminato"
   ;;

   -3) echo "Errore Tolta corrente perche' scheda non raggiungibile"
       SUBJ="ERROR: Tolta corrente all'impianto ciclo fermato"
       BODY="E' stata tolta la corrente all'impianto di irrigazione perche' la scheda non ha risposto ai tentativi di contatto durante il ciclo di irrigazione"

   ;;
   -4) echo "Errore Grave non risponde BT004"
       SUBJ="FATAL : Non e' stato possibile togliere la corrente all'impianto di irrigazione"
       BODY="La scheda non ha risposto nei tempi durante il ciclo di irrigazione, si e' tentato un arresto forzato togliendo la corrente, ma il Relay BT004 non ha risposto"
   ;;
esac

