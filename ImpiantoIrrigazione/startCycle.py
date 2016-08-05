import socket
import sys
import time
from sys import argv
from common.MongoDbHandler import logEvent, getRain,getTotalRainDays,getTotalIrrigatedWater
from common.logAction import *
from common.bt004 import *
from common.config import irrigazione
from common.irrigazione import *
from os import path
from math import ceil

FILE_NAME=path.basename(__file__)

logOut(4,FILE_NAME,"Avvio "+argv[0]+" lettura configurazione")
cfgIrr = irrigazione()


#Tempo irrigazione per singola area espresso in minuti
TIMING = cfgIrr['Zone']
SOGLIA_IRRIGAZIONE = cfgIrr['Soglia Irrigazione']
DEBUG=cfgIrr['Debug']
ON="01"
OFF="00"
NUM_SEC=cfgIrr['NumSec']
COMMON=cfgIrr['Common Gate']
GG_TOT_ACQUA = cfgIrr['PolicyIrrigazione']['03']['GiorniCalcoloTotaleAcqua']

# Calcolo il fabbisogno d'acqua al Mq in relazione alla
# Temperatura e vento dei gg precedenti
FabbisognoAcqua=[]
pioggiaCaduta=[]
for gg in range(GG_TOT_ACQUA):
    FabbisognoAcqua.append(calcolaFabbisognoAcqua(gg))

    # Calcolo quanti mm di pioggia (litri/mq) sono caduti
    # nei giorni precedenti
    pioggiaCaduta = getTotalRainDays(GG_TOT_ACQUA)



# Questa funzione viene lanciata durante il ciclo di attesa per
# interrompere l'irrigazione epassare alla zona successiva. Durante
# questo tempo viene controllato se viene forzato un arresto del sistema

def waitingForStop(zona):

    # Calcolo Per quanto tempo devo tenere aperto il rubinetto
    # Faccio il loop sulle giornate precedenti e verifico la differenza, per 
    # zona tra il Fabbisogno d'acqua e quanto ricevuto effettivamente da 
    # irrigazioni piogge
    # Vettore acqua irrigata nei giorni precedenti
    AcquaIrrigata = getTotalIrrigatedWater(GG_TOT_ACQUA,zona)
    AcquaEffettivaTotale = 0.0
    for gg in range(GG_TOT_ACQUA):

        AcquaEffettiva = FabbisognoAcqua[gg] - pioggiaCaduta[gg] - AcquaIrrigata[gg]
        logOut(5,FILE_NAME,"Per il giorno "+str(gg)+\
            " Il fabbisogno era di "+str(FabbisognoAcqua[gg])+\
            " Pioggia caduta "+str(pioggiaCaduta[gg])+\
            " Acqua irrigata "+str(AcquaIrrigata[gg])+\
            " Acqua da irrigare "+str(AcquaEffettiva))

        AcquaEffettivaTotale += AcquaEffettiva

    # Verifico per questa zona se il quantitativo d'acqua da distribuire 
    # supera la soglia minima.
    SOGLIA_IRRIGAZIONE = float(cfgIrr['PolicyIrrigazione']['03']['Zone']\
        [int(zona)-1]['SogliaLitriIrrigazioneMq'])
    MQ_ZONA = float(cfgIrr['PolicyIrrigazione']['03']['Zone']\
        [int(zona)-1]['Mq'])

    logOut(5,FILE_NAME,"La sogia minima di irrigazione per la zona  "+zona+\
        " e' di "+str(SOGLIA_IRRIGAZIONE * MQ_ZONA)+" litri"\
        " L'acqua effettiva da irrigare e' "+str(AcquaEffettivaTotale * MQ_ZONA))

    if(AcquaEffettivaTotale * MQ_ZONA > SOGLIA_IRRIGAZIONE * MQ_ZONA):

        logOut(4,FILE_NAME,"Soglia minima superata. Irrigo")

        # Recupero dal database di configurazione la portata dell'impianto
        # per questa zona.
        PORTATA = float(cfgIrr['PolicyIrrigazione']['03']['Zone']\
            [int(zona)-1]['Portata_lsec'])

        # Mi calcono il numeor di secondi in cui l'elettrovalvola deve 
        # rimanere aperta.
        TempoIrrigazione = int(ceil(AcquaEffettiva / PORTATA))


        # Aggiungo un offset per tener conto del tempo di start dell'impianto
        TempoIrrigazione += 3
        logOut(4,FILE_NAME,"Tempo irrigazione : "+str(TempoIrrigazione))

        # Entro in loop ed attendo la fine del ciclo. Intanto verifico
        # eventuali stop del sistema
        for sec in range(TempoIrrigazione):
                # Faccio la verifica di un eventuale stop

            time.sleep(1)

    else:
        logOut(5,FILE_NAME,"Soglia irrigazione non superata per  "+zona+" non irrigo")


    

def cycle():
    logOut(4,FILE_NAME,"Inizio Ciclo irrigazione DEBUG= "+DEBUG)
    logEvent('INFO', 'Irrigazione', 'Inizio ciclo irrigazione', 'DEBUG='+DEBUG)
    if(DEBUG!="True"):
        sendCommand(COMMON, ON,0)                   # Se non sono in debug attivo il connettore comune

    cont=0
    for tzona in TIMING:
        cont+=1
        zona="0"+str(cont)

        logEvent('INFO', 'Irrigazione', 'Inizio irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))
        sendCommand(zona, ON, 0)
            
        # Questa funzione calcola il tempo necessario all'impianto per erogare
        # la quantita giusta di acqua calcolata. Durante l'irrigazione verifica il caso
        # di un eventuale arresto forzato.
        waitingForStop(zona)

        logOut(4,FILE_NAME,"Fine zona  "+zona+" per minuti "+str(tzona))
        sendCommand(zona, OFF, 0)
        logEvent('INFO', 'Irrigazione', 'Fine irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))


    sendCommand(COMMON, OFF, 0)                      # Chiudo anche il connettore comune
    logEvent('INFO', 'Irrigazione', 'Fine ciclo irrigazione', '')
    exit(0)


# Controllo della temperatura media durante la giornata precedente
# eventuale incremento di acqua se temperatura media maggiore di una soglia
# Razione Acqua = BASE + INCREMENTO


# Controllo se ha piovuto giornata precedente e mm di acqua caduti
# Decrementare la razione d'acqua calcolata precedentemente con acqua caduta per pioggia
#  IRRIGAZIONE = Razione Acqua - PIOGGIA CADUTA

rain = getRain(1)
logOut(3,FILE_NAME,"Millimetri pioggia caduti ieri "+str(rain))
if ( rain > SOGLIA_IRRIGAZIONE):  # Temporaneamente verifico solo se sono al di sopra di una certa soglia per irrigare
    logOut(3,FILE_NAME,"Soglia superata, non irrigo")
    exit(1)



#Inizzializzazione Porte
rc = initPorts()
if (rc<0):
    exit(rc)


logOut(4,FILE_NAME,"Inizio Ciclo irrigazione, richiamo Cycle() ")
cycle()


