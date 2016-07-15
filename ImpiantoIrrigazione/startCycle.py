import socket
import sys
import time
from sys import argv
from common.MongoDbHandler import logEvent, getRain
from common.logAction import *
from common.bt004 import *
from common.config import irrigazione
from common.irrigazione import sendCommand,initPorts


logOut(4,argv[0],"Avvio "+argv[0]+" lettura configurazione")
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
    logOut(4,argv[0],"Inizio Ciclo irrigazione DEBUG= "+DEBUG)
    logEvent('INFO', 'Irrigazione', 'Inizio ciclo irrigazione', 'DEBUG='+DEBUG)
    if(DEBUG!="True"):
        sendCommand(COMMON, ON,0)                   # Se non sono in debug attivo il connettore comune

    cont=0
    for tzona in TIMING:
        cont+=1
        zona="0"+str(cont)
        logOut(4,argv[0],"Inizio zona  "+zona+" per minuti "+str(tzona))
        logEvent('INFO', 'Irrigazione', 'Inizio irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))
        sendCommand(zona, ON, 0)
        time.sleep(tzona['timing']*NUM_SEC)
        logOut(4,argv[0],"Fine zona  "+zona+" per minuti "+str(tzona))
        sendCommand(zona, OFF, 0)
        logEvent('INFO', 'Irrigazione', 'Fine irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))

    sendCommand(COMMON, OFF, 0)                      # Chiudo anche il connettore comune
    logEvent('INFO', 'Irrigazione', 'Fine ciclo irrigazione', '')
    #sendMail("INFO Ciclo irrigazione","Ciclo irrigazione finito correttamente","False")
    exit(0)


#Inizzializzazione Porte
rc = initPorts()
if (rc<0):
    exit(rc)


# Controllo della temperatura media durante la giornata precedente
# eventuale incremento di acqua se temperatura media maggiore di una soglia
# Razione Acqua = BASE + INCREMENTO


# Controllo se ha piovuto giornata precedente e mm di acqua caduti
# Decrementare la razione d'acqua calcolata precedentemente con acqua caduta per pioggia
#  IRRIGAZIONE = Razione Acqua - PIOGGIA CADUTA

rain = getRain()
logOut(3,argv[0],"Millimetri pioggia caduti ieri "+str(rain))
if ( rain > SOGLIA_IRRIGAZIONE):  # Temporaneamente verifico solo se sono al di sopra di una certa soglia per irrigare
    logOut(3,argv[0],"Soglia superata, non irrigo")
    #sendMail("INFO Ciclo irrigazione","Nella giornata di ieri sono caduti "+str(rain)+" mm di pioggia. Non irrigo perche non necessario","False")
    exit(1)


logOut(4,argv[0],"Inizio Ciclo irrigazione, richiamo Cycle() ")
cycle()


