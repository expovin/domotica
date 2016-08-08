import socket
import sys
import time
from sys import argv
from common.MongoDbHandler import *
from common.logAction import *
from common.bt004 import *
from common.config import irrigazione
from common.irrigazione import *
from os import path, remove
from math import ceil

FILE_NAME=path.basename(__file__)

logOut(4,FILE_NAME,"Avvio "+argv[0]+" lettura configurazione")
cfgIrr = irrigazione()
TIMING=cfgIrr['Zone']
SOGLIA_IRRIGAZIONE=cfgIrr['Soglia Irrigazione']
ON="01"
OFF="00"
DEBUG=cfgIrr['Debug']
NUM_SEC=cfgIrr['NumSec']
COMMON=cfgIrr['Common Gate']
GG_TOT_ACQUA=cfgIrr['PolicyIrrigazione']['03']['GiorniCalcoloTotaleAcqua']
# Calcolo quanti mm di pioggia (litri/mq) sono caduti
# nei giorni precedenti
pioggiaCaduta = getTotalRainDays(GG_TOT_ACQUA)


def getFabbisognoPioggia():
    # Calcolo il fabbisogno d'acqua al Mq in relazione alla
    # Temperatura e vento dei gg precedenti
    FabbisognoAcqua=[]
    pioggiaCaduta=[]
    for gg in range(GG_TOT_ACQUA):
        FabbisognoAcqua.append(calcolaFabbisognoAcqua(gg))


    return (FabbisognoAcqua)

def calcolaTempoIrrigazione(zona,FabbisognoAcqua,pioggiaCaduta):
    TempoIrrigazione = 0

    # Calcolo Per quanto tempo devo tenere aperto il rubinetto
    # Faccio il loop sulle giornate precedenti e verifico la differenza, per 
    # zona tra il Fabbisogno d'acqua e quanto ricevuto effettivamente da 
    # irrigazioni piogge
    # Vettore acqua irrigata nei giorni precedenti

    # Recupero dal database di configurazione la portata dell'impianto
    # per questa zona.
    PORTATA = float(cfgIrr['PolicyIrrigazione']['03']['Zone'][int(zona)-1]\
        ['Portata_lsec'])    

    AcquaIrrigata = getTotalIrrigatedWater(GG_TOT_ACQUA,zona)
    AcquaEffettivaTotale = 0.0
    for gg in range(GG_TOT_ACQUA):
        MQ_ZONA = float(cfgIrr['PolicyIrrigazione']['03']['Zone']\
            [int(zona)-1]['Mq'])

        AcquaEffettiva = FabbisognoAcqua[gg] - pioggiaCaduta[gg] -\
            ( AcquaIrrigata[gg] / MQ_ZONA)

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

    logOut(5,FILE_NAME,"La sogia minima di irrigazione per la zona  "+zona+\
        " e' di "+str(SOGLIA_IRRIGAZIONE * MQ_ZONA)+" litri"\
        " L'acqua effettiva da irrigare e' "+str(AcquaEffettivaTotale * MQ_ZONA))

    if(AcquaEffettivaTotale * MQ_ZONA > SOGLIA_IRRIGAZIONE * MQ_ZONA):

        # Mi calcono il numeor di secondi in cui l'elettrovalvola deve 
        # rimanere aperta.
        TempoIrrigazione = int(ceil(AcquaEffettivaTotale * MQ_ZONA / PORTATA))

    return(TempoIrrigazione)


# Questa funzione viene lanciata durante il ciclo di attesa per
# interrompere l'irrigazione epassare alla zona successiva. Durante
# questo tempo viene controllato se viene forzato un arresto del sistema

def waitingForStop(zona,tempo):

    PORTATA = float(cfgIrr['PolicyIrrigazione']['03']['Zone'][int(zona)-1]\
        ['Portata_lsec'])    

     ###########################################################################   

    # Entro in loop ed attendo la fine del ciclo. Intanto verifico
    # eventuali stop del sistema
    for sec in range(tempo):
        # Faccio la verifica di un eventuale salto di questa zona
        if(path.isfile('skipZone.tmp')):
            remove('skipZone.tmp')
            break;

        if(path.isfile('stop.tmp')):
            remove('stop.tmp')
            recordIrrigatedWater(PORTATA * sec, zona, sec)
            controlledStopCycle()

        time.sleep(1)

        # Scrivo sul DB l'Acqua effettivamente irrigata
    logOut(5,FILE_NAME,"Uscita ciclo irrigazione dopo secondi : "+str(sec))
    recordIrrigatedWater(PORTATA * sec, zona, sec)



def irrigaZona(zona,tempo,FabbisognoAcqua,pioggiaCaduta):
    
    TempoIrrigazione = calcolaTempoIrrigazione(zona,FabbisognoAcqua,pioggiaCaduta)

    if(TempoIrrigazione > 0):
        # Tempo di apertura ugelli in secondi 
        TempoIrrigazione += 10

        logOut(3,FILE_NAME,"Soglia minima superata. Irrigo per "\
            +str(TempoIrrigazione)+" secondi")

        sendCommand(zona, ON, 0)
            
        # Attesa secondi. Durante l'irrigazione verifica il caso
        # di un eventuale arresto forzato.
        waitingForStop(zona,TempoIrrigazione)

        logOut(4,FILE_NAME,"Fine zona  "+zona+" per minuti "+zona)
        sendCommand(zona, OFF, 0)
    else:
        logOut(5,FILE_NAME,"Soglia irrigazione non superata per  "+zona+" non irrigo")    



def cycle(FabbisognoAcqua,pioggiaCaduta):
    logOut(4,FILE_NAME,"Inizio Ciclo irrigazione DEBUG= "+DEBUG)
    logEvent('INFO', 'Irrigazione', 'Inizio ciclo irrigazione', 'DEBUG='+DEBUG)
    if(DEBUG!="True"):
        sendCommand(COMMON, ON,0)                   # Se non sono in debug attivo il connettore comune

    cont=0
    for tzona in TIMING:
        cont+=1
        zona="0"+str(cont)

        logEvent('INFO', 'Irrigazione', 'Inizio irrigazione zona', 'Zona='+zona+\
            ' per minuti :'+str(tzona))
        irrigaZona(zona,0,FabbisognoAcqua,pioggiaCaduta)
        logEvent('INFO', 'Irrigazione', 'Fine irrigazione zona', 'Zona='+zona+\
            ' per minuti :'+str(tzona))


    sendCommand(COMMON, OFF, 0)                      # Chiudo anche il connettore comune
    logEvent('INFO', 'Irrigazione', 'Fine ciclo irrigazione', '')
    exit(0)




#Inizzializzazione Porte
def initPorte():
    rc = initPorts()
    if (rc<0):
        exit(rc)


if __name__ == "__main__":
    #getTemp(sys.argv[1])
    #logEvent(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    logOut(4,FILE_NAME,"Inizio Ciclo irrigazione, richiamo Cycle() ")
    initPorte()
    FabbisognoAcqua = getFabbisognoPioggia()    
    cycle(FabbisognoAcqua,pioggiaCaduta)


