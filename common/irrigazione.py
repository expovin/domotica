################################################################################
# irrigazione.py                                                               #
#                                                                              #
# Funzioni di controllo per la scheda relay di controllo irrigazione
################################################################################

from sys import argv
import socket
from config import irrigazione
from MongoDbHandler import logEvent
from time import sleep
from bt004 import *
from logAction import *

logOut(4,argv[0],"Avvio "+argv[0]+" lettura configurazione")

# Lettura configurazione da MongoDB
cfgIrr = irrigazione()

############### PARAMETRI LETTI ALLO START DELLA FUNZIONE ######################

# Attiva o meno la porta comune #8. Quando non attiva l'impianto non connette i 
# singoli irrigatori
DEBUG = cfgIrr['Debug']

# TimeOut di connessione in attesa della risposta della scheda Relay via UDP
# se la scheda non risponde in questo tempo, si ipotizza irragiungibilita e 
# viene avviata la procedura di emergenza
SOCKET_TIME_OUT = cfgIrr['socket timeout']              

# Definito fisso come FF
MESSAGE_PREFIX = cfgIrr['Message Prefix']

# Numero massimo di tentativi nella ritrasmissione del comando. 
MAX_TENTATIVE = cfgIrr['Max Tentative']

# ARRAY di minuti nel tentare il riavvio del ciclo di irrigazione se la scheda 
# non risponde. Viene atteso un numero di minuti pari al primo elemento 
# dell'array, viene fatto un secondo tentativo e se non ancora funzionante si
# attende un numero di minuti pari al secondo elemento e cosi via.
RETRY = cfgIrr['Retry']


UDP_IP=cfgIrr['Relay Board IP']       # IP Address Relay Board
UDP_PORT=cfgIrr['Relay Board Port']   # Porta di comunicazione UDP Relay Board
COMMON=cfgIrr['Common Gate']          # Porta comune Relay Board


logOut(4,argv[0],"Inizzializzazione socket e set timeout")
sock = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
sock.settimeout(SOCKET_TIME_OUT)



# Questa  la procedura di inizializzazione. Si occupa di azzerare tutte le porte 
# della scheda relay. Viene utilizzata anche per verificare se la scheda risponde 
# ai comandi. In caso di non risposta si posticipa l'irrigazione secondo l'Array 
# di retray
def initPorts():
    SCHADA_OK = False                     # Flag se la scheda risponde o meno.
    # Ciclo per il numero di tentativi presenti nell'ARRAY di Retry
    if(SCHADA_OK==False):
        logOut(4,argv[0],"Inizzializzazione Porte")
        for r in RETRY:
            logOut(3,argv[0],"Inizio ciclo irrigazione variabile DEBUG = "+DEBUG)
            logEvent('INFO', 'Irrigazione', 'Inizio ciclo irrigazione', 'DEBUG='+DEBUG)  
            # Comando reset porte
            COMMAND=MESSAGE_PREFIX+"E000"
            sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
            statusPort = getStatusPort()
            logOut(3,argv[0],"Inviato comando reset Porte. Stato porte ritornato : "+str(statusPort))
            if(statusPort == -1):
                logOut(1,argv[0],"La scheda non risponde, riprovo tra "+str(r)+" minuti")
                sleep(r*60)
            else:
                SCHADA_OK = True
                break;

    if(SCHADA_OK):
        # Tolgo la corrente alla scheda relay in modo da chiudere l'acqua
        #logOut(3,argv[0],"Chiudo per precauzione il relay, nel caso fosse rimasto aperto")
        #InactivePort("1","0")

        logOut(3,argv[0],"Scheda correttamente resettata, parto con il ciclo di irrigazione")
        # La scheda ha risposto, parto con l'irrigazione. Verifico prima il flag di DEBUG
        if(DEBUG!="True"):
            logOut(3,argv[0],"Stato di Esercizio, collego il connettore comune")
            sendCommand(COMMON, "01",0)                   # Se non sono in debug attivo il connettore comune
        return 0
    else:
        #La scheda non risponde, ritorno -1
        logOut(0,argv[0],"La scheda non ha risposto nei tentativi interrompo l'irrigazione")
        logEvent('ERROR', 'Irrigazione', 'Errore  scheda fuori linea', 'La scheda relay non ha risposto. Irrigazione terminata ')
        return -1

# Questa funzione attiva o disattiva una certa zona di irrigazione relativamente 
# al canale (channel) e stato (status) inviati Accetta anhe un numero di tentativi. 
# Viene chiamata con tentative = 0. Questa funzione controllo il reale stato 
# delle porte a valle dell'invio del comando. Se le porte non hanno recepito il 
# comando, viene fatto un ulteriore tentativo fino a raggiungere il numero 
# massimo di tentativi.
def sendCommand(channel, status, tentative):
    COMMAND=MESSAGE_PREFIX+channel+status

    while tentative < MAX_TENTATIVE:
        logOut(4,argv[0],"Invio comando "+COMMAND+" Tentativo n "+str(tentative))
        sock.sendto(COMMAND, (UDP_IP, UDP_PORT))    
        statusPort = getStatusPort()
        logOut(4,argv[0],"Stato porte ricevuto "+str(statusPort))

        if(int(statusPort) == -1):
            logOut(0,argv[0],"Errore TIME-OUT scheda non raggiungibile, richiamo procedura di mergenza ")
            emergencyExit()
        else:
            idx = int(channel)-1
            ch = int(statusPort[idx])
            st = int(status)
            if(ch == st):
                logOut(4,argv[0],"Comando eseguito correttamente")
                break;
            else:
                if(tentative == MAX_TENTATIVE):
                    logOut(1,argv[0],"Raggiunto numero massimo di tentativi con comunicazione alla scheda, interrompo ciclo irrigazione")
                    stopCycle()
                
                logOut(2,argv[0],"Letto stato porte "+str(statusPort)+" reinvio comando ")
                tentative +=1
                sleep(2)
                sendCommand(channel, status, tentative)



# Questa funzione verifica l'effettivo stato delle porte. Viene lanciata ad ogni 
# cambio stato per verificare l'effettiva ricezione del comando. Ritorna -1 se 
# la sceda non risponde nel TIME_OUT stabilito
def getStatusPort():
    COMMAND=MESSAGE_PREFIX+"0000"
    sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
    sleep(1)

    try:
        data, addr = sock.recvfrom(1024)
        # Pulisco il buffer da dati sporchi
        FlushListen(sock) 
        return data
    except:
        return -1


def FlushListen(sock):
    try:
        data, addr = sock.recvfrom(1024)
    except:
        return;

# Questo ciclo viene lanciato quando, pur riuscendo ad arrivare alla scheda 
# relay, viene riscontrato errore nella ricezione dei comandi. Nel caso la 
# procedura di stop non funzioni viene lanciata la procedura di emergenza.
def stopCycle():
    statusPort = getStatusPort()
    logOut(1,argv[0],"Procedura di interruzione ciclo, stato attuale porte "+str(statusPort))
    logEvent('ERROR', 'Irrigazione', 'Errore  invio comando', 'Stato attuale delle porte '+str(statusPort))
    logOut(1,argv[0],"Provo a resettare porte ")
    COMMAND=MESSAGE_PREFIX+"E000"
    sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
    statusPort = getStatusPort()
    logOut(1,argv[0],"Stato porte "+str(statusPort))
    if(statusPort != "00000000"):
        logOut(0,argv[0],"La scheda non risponde, avvio procedura di emergenza")
        emergencyExit() 
    else:
        logOut(1,argv[0],"Ciclo fermato correttamente")
        #sendMail("Errore ciclo di irrigazione","Errore durante l'invio di un comando alla scheda relay","False")
        exit(-2)


# Procedura di interruzione corrente. Questa procedura viene chiamata quando in 
# fase di irrigazione non e possibile piu raggiungere la scheda relay. In questo 
# caso viene attivata la porta 1 del relay BT004 che toglie corrente alla scheda 
# relay.
def emergencyExit():
    logOut(0,argv[0],"PROCEDURA DI EMERGENZA PER INTERROMPERE CORRENTE")
    logEvent('FATAL', 'Irrigazione', 'Errore Modulo realy non risponde ', 'Avvio tentativo di emergenza per chiudere acqua')

    # Tolgo la corrente alla scheda relay in modo da chiudere l'acqua
    ActivePort("1","0")

    # Verifico l'effettivo cambio di stato della porta 1 della scheda.
    # TODO : In caso venga riscontrato errore nella ricezone del comando entrare 
    # in un lop per MAX_RETRY definiti
    if(getPortState("1") == "ACTIVE\r"):
        logOut(0,argv[0],"Corrente Tolta, attendo 10 min prima di riattivarla")
        #sendMail("Errore grave ciclo irrigazione","Scheda non piu rangiungibile via IP, avviata procedura di stop in emergenza, tolta corrente all'impianto","Irrigazione")
        sleep(600)
        InactivePort("1","0")                    # dopo 10 min.  riabilito la corrente
        logOut(0,argv[0],"Corrente riattivata")
    else:
        logOut(0,argv[0],"ATTENZIONE!!! Non sono riuscito a modificare lo stato della porta BT004")
        #sendMail("Errore grave ciclo irrigazione","Scheda non piu rangiungibile via IP, Errore nel togliere la corrente alla scheda","Irrigazione")
    exit(-3)  
