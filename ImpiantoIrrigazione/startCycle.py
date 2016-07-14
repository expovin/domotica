import socket
import sys
import time
from common.MongoDbHandler import logEvent, getRain
from common.sendMail import sendMail
from common.bt004 import *
from common.config import irrigazione
from common.irrigazione import sendCommand,initPorts

cfgIrr = irrigazione()


#Tempo irrigazione per singola area espresso in minuti
TIMING = cfgIrr['Zone']
SOGLIA_IRRIGAZIONE = cfgIrr['Soglia Irrigazione']
DEBUG=cfgIrr['Debug']
ON="01"
OFF="00"
NUM_SEC=cfgIrr['NumSec']
COMMON=cfgIrr['Common Gate']


def cycle():
    logEvent('INFO', 'Irrigazione', 'Inizio ciclo irrigazione', 'DEBUG='+DEBUG)
    if(DEBUG!="True"):
        sendCommand(COMMON, ON,0)                   # Se non sono in debug attivo il connettore comune

    cont=0
    for tzona in TIMING:
        cont+=1
        zona="0"+str(cont)
        logEvent('INFO', 'Irrigazione', 'Inizio irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))
        print "Inizio Zona ",zona," per ",str(tzona)," minuti"
        sendCommand(zona, ON, 0)
        time.sleep(tzona['timing']*NUM_SEC)
        print "Fine Zona ",zona
        sendCommand(zona, OFF, 0)
        logEvent('INFO', 'Irrigazione', 'Fine irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))

    sendCommand(COMMON, OFF, 0)                      # Chiudo anche il connettore comune
    logEvent('INFO', 'Irrigazione', 'Fine ciclo irrigazione', '')
    sendMail("INFO Ciclo irrigazione","Ciclo irrigazione finito correttamente","False")


#Inizzializzazione Porte
if (initPorts()==-1):
    exit()


# Controllo della temperatura media durante la giornata precedente
# eventuale incremento di acqua se temperatura media maggiore di una soglia
# Razione Acqua = BASE + INCREMENTO


# Controllo se ha piovuto giornata precedente e mm di acqua caduti
# Decrementare la razione d'acqua calcolata precedentemente con acqua caduta per pioggia
#  IRRIGAZIONE = Razione Acqua - PIOGGIA CADUTA

rain = getRain()
if ( rain > SOGLIA_IRRIGAZIONE):  # Temporaneamente verifico solo se sono al di sopra di una certa soglia per irrigare
    sendMail("INFO Ciclo irrigazione","Nella giornata di ieri sono caduti "+str(rain)+" mm di pioggia. Non irrigo perche non necessario","False")
    exit()

cycle()


if __name__ == "__main__":
    #sendCommand(sys.argv[1],sys.argv[2])
    cycle()

