################################################################################
# BT004                                                                        #
#                                                                              #
# Questo modulo si occupa di comandare la scheda Relay Bluethoot BT004 le      #
# sono state implementate tutte le funzioni supportate dalla scheda. I canali  #
# utilizzati sono :                                                            #
#   1) Box - Luci  : Per togliere corrente alla scheda Relay irrigazione       #
#   2) Antenna TV  : Da implementare schedulazione orari funzionamento TV      #
#   3) Luci 1 Piano: Eventuale implementazione scenari luci quando in ferie    #
#   4) Luci Esterne: Eventale start decorazioni natalizie                      #
# tutte le funzioni controllano la risposta della scheda ritrasmettendola come #
# ritorno di funzione                                                          #
#                                                                              # 
################################################################################
#                                                                              #
#  v1.0 :Stesura prima versione con i metodi GetInfo, ActivePort, InactivePort #
#        getPortState e getModuleSupplyVoltage                                 #
#  v1.1 :Aggiunta modulo Try catch sulla connessione alla scheda. Nel caso la  #
#        scheda fosse fuori linea il modulo non va in errore                   #
#                                                                              #
################################################################################


import bluetooth
import serial
from time import sleep
from logAction import *
from os import path

FILE_NAME=path.basename(__file__)


DEVICE = '20:14:04:25:16:07'  # ID Device
CMD_GetModuleInfo = ':GMI\r'  # GetModuleInfo
#DOA : Digital Output Active
CMD_DOA = ":DOA,x,y\r"        # DOA x active for y milliseconds 0 for permanent
#DOI : Digital Output Inactive
CMD_DOI = ':DOI,x,y\r'        # DOI x active for y milliseconds 0 for permanent
CMD_GDO = ':GDO,x\r'          # Get the satate of output x
CMD_GSV = ':GSV\r'            # Get Module supply voltage


sockfd = bluetooth.BluetoothSocket(bluetooth.RFCOMM)

try:
    sockfd.connect((DEVICE, 1))
except:
    logOut(0,FILE_NAME,"ERRORE Connessione a BT004")


def GetInfo():
    sockfd.send(CMD_GetModuleInfo)
    sleep(2)
    data = sockfd.recv(1024)
    return data

def ActivePort(port,time):
    MyDoa = CMD_DOA
    MyDoa = MyDoa.replace("x",port)
    MyDoa = MyDoa.replace("y",time)
    sockfd.send(MyDoa)
    sleep(2)
    data = sockfd.recv(1024)
    return data

def InactivePort(port, time):
    MyDoi = CMD_DOI.replace("x", port)
    MyDoi = MyDoi.replace("y", time)
    sockfd.send(MyDoi)
    sleep(2)
    data = sockfd.recv(1024)
    return data

def getPortState(port):
    MyGdo = CMD_GDO.replace("x", port)
    sockfd.send(MyGdo)
    sleep(2)
    data = sockfd.recv(1024)
    return data

def getModuleSupplyVoltage():
    sockfd.send(CMD_GSV)
    sleep(2)
    data = sockfd.recv(1024)
    return data



