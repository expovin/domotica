################################################################################
#  Attuatori.py
#  Questa funzione mette a fattor comune la gestione degli stati di tutti gli  #
#  attuatori. Le schede rele sono state divise in famiglie di attuatori ed sono#
#  indirizzate con funzioni specifiche dal nome Tipo presente nel catalogo     #
#  degli attuatri
################################################################################
import RPi.GPIO as GPIO
import pymongo
from bson.objectid import ObjectId
import bt004
import logAction as LG
import sys
from DBHandler import logEvent
from os import path
import argparse
from config import irrigazione
import socket
from time import sleep

# Nome di questo file 
FILE_NAME=path.basename(__file__)

# Configurazione connessione locale Mongo
connection = pymongo.MongoClient()
# Utilizzo della Collection catalogo degli attuatori
db=connection.domotica.Dispositivi
db1=connection.domotica.Attuatori
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

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


LG.logOut(4,FILE_NAME,"Inizzializzazione socket e set timeout")
sock = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
sock.settimeout(SOCKET_TIME_OUT)

#################################################################################
# Questa  la procedura di inizializzazione. Si occupa di azzerare tutte le porte 
# della scheda relay. Viene utilizzata anche per verificare se la scheda risponde 
# ai comandi. In caso di non risposta si posticipa l'irrigazione secondo l'Array 
# di retray
def initPorts():
    SCHADA_OK = False                     # Flag se la scheda risponde o meno.
    # Ciclo per il numero di tentativi presenti nell'ARRAY di Retry
    if(SCHADA_OK==False):
        LG.logOut(4,FILE_NAME,"Inizzializzazione Porte")
        for r in RETRY:
            LG.logOut(3,FILE_NAME,"Inizio ciclo irrigazione variabile DEBUG = "+DEBUG)
            LG.logEvent('INFO', 'Irrigazione', 'Inizio ciclo irrigazione', 'DEBUG='+DEBUG)  
            # Comando reset porte
            COMMAND=MESSAGE_PREFIX+"E000"
            sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
            statusPort = getStatusPort()
            LG.logOut(3,FILE_NAME,"Inviato comando reset Porte. Stato porte ritornato : " \
                +str(statusPort))
            if(statusPort == -1):
                LG.logOut(1,FILE_NAME,"La scheda non risponde, riprovo tra " \
                    +str(r)+" minuti")
                sleep(r*60)
            else:
                SCHADA_OK = True
                break;

    if(SCHADA_OK):
        # Tolgo la corrente alla scheda relay in modo da chiudere l'acqua
        LG.logOut(3,FILE_NAME,"Chiudo per precauzione il relay, nel caso fosse rimasto aperto")
        #InactivePort("1","0")

        LG.logOut(3,FILE_NAME,"Scheda correttamente resettata, parto con il ciclo di irrigazione")
        # La scheda ha risposto, parto con l'irrigazione. Verifico prima il flag di DEBUG
        if(DEBUG!="True"):
            LG.logOut(3,FILE_NAME,"Stato di Esercizio, collego il connettore comune")
            sendCommand(COMMON, "01",0)                   # Se non sono in debug attivo il connettore comune
        return 0
    else:
        #La scheda non risponde, ritorno -1
        LG.logOut(0,FILE_NAME,"La scheda non ha risposto nei tentativi interrompo l'irrigazione")
        return -1

def FlushListen(sock):
    try:
        data, addr = sock.recvfrom(1024)
    except:
        return;
#################################################################################

def ETH(appli,stato, tentative=0):
    channel = str(appli['NumeroPorta']).rjust(2,'0')
    status = str(stato).rjust(2,'0')
    COMMAND=str(MESSAGE_PREFIX)+str(channel)+str(status)

    while tentative < MAX_TENTATIVE:
        LG.logOut(4,FILE_NAME,"Invio comando "+COMMAND+" Tentativo n "+str(tentative))
        sock.sendto(COMMAND, (UDP_IP, UDP_PORT))    
        statusPort = ETHGet(appli)
        LG.logOut(4,FILE_NAME,"Stato porte ricevuto "+str(statusPort))

        if(int(statusPort) == -1):
            LG.logOut(0,FILE_NAME,"Errore TIME-OUT scheda non raggiungibile, richiamo procedura di mergenza ")
            return -1
        else:
            idx = int(channel)-1
            ch = int(statusPort[idx])
            st = int(status)
            if(ch == st):
                LG.logOut(4,FILE_NAME,"Comando eseguito correttamente")
                aggiornaStatoDB(appli,stato)
                break;
            else:
                if(tentative == MAX_TENTATIVE):
                    LG.logOut(1,FILE_NAME,"Raggiunto numero massimo di tentativi" \
                        " con comunicazione alla scheda, interrompo ciclo irrigazione")
                    #stopCycle()
                
                LG.logOut(2,FILE_NAME,"Letto stato porte "+str(statusPort)+ \
                    " reinvio comando ")
                tentative +=1
                sleep(1)
                sendCommand(channel, status, tentative)





def aggiornaStatoDB(appli,stato):
    if(stato==1):
        currStatus=True
    else:
        currStatus=False

    LG.logOut(4,FILE_NAME,"Aggiorno lo stato del database, _id: "+str(appli['_id'])+" Stato :"+str(currStatus) )
    db.update({
       "_id" : appli['_id'],  
    },{
       '$set' : {
            'Stato' : currStatus
        }
    },upsert=False)


# Funzione di gestione degli attuatori connessi ai PIN del GPIO. Per questi
# attuatori e' sufficente modificare lo stato del PIN di uscita
def PN(appli, stato):
    PinOut=int(appli['GPIO'])                # Recupero il numero PIN del GPIO
    LG.logOut(5,FILE_NAME,"Pin da modificare "+str(PinOut))

    GPIO.setup(PinOut,GPIO.OUT)         # Setto il pin in uscita WARNING
    GPIO.output(PinOut,stato)           # Imposto il Pin allo stato richiesto

    if(stato==1):
        currStatus=True
    else:
        currStatus=False
    #Update stato DB
    print(appli)
    LG.logOut(4,FILE_NAME,"Aggiorno lo stato del database, _id: "+str(appli['_id'])+" Stato :"+str(currStatus) )
    db.update({
        "_id" : appli['_id'],  
    },{
        '$set' : {
            'Stato' : currStatus
        }
    },upsert=False)



def BT(appli, stato):

    Port=appli['NumeroPorta']                 # Recupero il numero di porta
    LG.logOut(5,FILE_NAME,"Porta da modificare "+str(Port))

    if (stato==1):                      # Verifico se attivarla o disattivarla
        bt004.ActivePort(str(Port),"0")    # Lo 0 indica il tempo (infinito) per
                                        # lo switch
        currStatus=True                              
    else:                               
        bt004.InactivePort(str(Port),"0")
        currStatus=False

    #Update stato DB
    LG.logOut(5,FILE_NAME,"Aggiorno lo stato del database")
    db.update({
        "_id" : appli['_id'],  
    },{
        '$set' : {
            'Stato' : currStatus
        }
    },upsert=False)


# La funzione setStato reperisce dal catalogo degli attuatori tutti i dettagli
# cercando l'attuatore per appliance collegato. Verifica il tipo di attuatore e
# richiama la funzione di gestione (Stesso nome del tipo attuatore)
def setStato(appliance,stato):
    LG.logOut(4,FILE_NAME,"Richiesta di cambio stato per appliance : "+str(appliance)\
        +" nuovo stato :"+str(stato))
    appli = db.find_one({'_id':ObjectId(appliance)})
    stato=int(stato)

    LG.logOut(4,FILE_NAME,"Recuperato Appliance : "+appli['Dispositivo'])

    Attuatore=db1.find_one({'_id':ObjectId(appli['AttuatoreId'])})              # Recupero il tipo attuatore
    Tipo=Attuatore['Prefix']
    LG.logOut(5,FILE_NAME,"Trovato tipo appliance "+Tipo)
    

    globals()[Tipo](appli,stato)        # Richiamo della funzione di gestione

    if(Attuatore['TracciaStoria'] == 1):
        logEvent('INFO', appliance, stato, "Cambio stato ")
    

def PNGet(appli):
    PinOut=int(appli['GPIO'])
    GPIO.setup(PinOut,GPIO.OUT)
    stato=GPIO.input(PinOut)
    LG.logOut(5,FILE_NAME,"Lo stato PIN "+str(PinOut)+" e': "+str(stato))   
    return (stato)

def ETHGet(appli):
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


def getStato(appliance):
    appli = db.find_one({'_id':ObjectId(appliance)}) 

    Attuatore=db1.find_one({'_id':ObjectId(appli['AttuatoreId'])})

    Tipo=Attuatore['Prefix']
    return (globals()[Tipo+"Get"](appli))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Aziona e verifica stato attuatori')
    parser.add_argument('Azione', help='getStato | setStato')
    parser.add_argument('Appliance', help='Nome da modificare o verificare')
    parser.add_argument('--stato', help='Necessaria con setStato, nuovo stato appliance',type=int)
    args=parser.parse_args()
    #parser.print_help()

    if(args.Azione == "getStato"):
        s=getStato(args.Appliance)
        print("Stato : "+str(s))
    else:
        setStato(args.Appliance,args.stato)

    #globals()[sys.argv[1]](sys.argv[2],sys.argv[3])

