import socket
import sys
import time
from common.MongoDbHandler import logEvent
from common.sendMail import sendMail


UDP_IP="192.168.0.199"
UDP_PORT=12345
MESSAGE_PREFIX="FF"
COMMON="08"

#Tempo irrigazione per singola area espresso in minuti
TIMING = [5, 5, 5, 5, 5]
NUM_SEC=60
MAX_TENTATIVE = 5 
DEBUG="True"

ON="01"
OFF="00"

sock = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
sock.settimeout(5.0)

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
        time.sleep(tzona*NUM_SEC)
        print "Fine Zona ",zona
        sendCommand(zona, OFF, 0)
        logEvent('INFO', 'Irrigazione', 'Fine irrigazione zona', 'Zona='+zona+' per minuti :'+str(tzona))

    sendCommand(COMMON, OFF, 0)                      # Chiudo anche il connettore comune
    logEvent('INFO', 'Irrigazione', 'Fine ciclo irrigazione', '')
    sendMail("INFO Ciclo irrigazione","Ciclo irrigazione finito correttamente","False")
 
def stopCycle():
    logEvent('ERROR', 'Irrigazione', 'Errore  invio comando', 'Stato attuale delle porte '+getStatusPort())
    COMMAND=MESSAGE_PREFIX+"E000"
    sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
    statusPort = getStatusPort()
    if(statusPort != "00000000"):
        emergencyExit() 
    else:
        print "Ciclo fermato correttamente"
        sendMail("Errore ciclo di irrigazione","Errore durante l'invio di un comando alla scheda relay","False")
        exit()

def emergencyExit():
    print "Funzione di Emergenza, la scheda non risponde" 
    logEvent('FATAL', 'Irrigazione', 'Errore Modulo realy non risponde ', 'Avvio tentativo di emergenza per chiudere acqua')
    sendMail("Errore grave ciclo irrigazione","Scheda non piu rangiungibile via IP, avviata procedura di stop in emergenza","False")
    exit()    

def sendCommand(channel, status, tentative):
    COMMAND=MESSAGE_PREFIX+channel+status
    print(" Tentativo n "+str(tentative)+" COMMAND : "+COMMAND)
    print("Port Status PRE "+str(getStatusPort()))
    sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
    while tentative < MAX_TENTATIVE:
        statusPort = getStatusPort()
        print("Port Status POST "+str(statusPort))
        if(int(statusPort) == -1):
            emergencyExit()
        else:
            idx = int(channel)-1
            ch = int(statusPort[idx])
            st = int(status)
            if(ch == st):
                print "Comando eseguito correttamente"
                break
            else:
           #     if(tentative == MAX_TENTATIVE):
           #         print "Raggiunto numero massimo di tentativi, fermo tutto"
           #         stopCycle()
                tentative +=1
                time.sleep(2)
           #    sendCommand(channel, status, tentative)

def getStatusPort():
    COMMAND=MESSAGE_PREFIX+"0000"
    sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
    while True:
        try:
            data, addr = sock.recvfrom(1024)
            return data
        except:
            return -1


if __name__ == "__main__":
    #sendCommand(sys.argv[1],sys.argv[2])
    cycle()

