import bluetooth
import serial
from time import sleep


DEVICE = '20:14:04:25:16:07'
CMD_GetModuleInfo = ':GMI\r'        # GetModuleInfo
CMD_DOA = ":DOA,x,y\r"              # Digital Output Active  Output x active for y milliseconds 0 for permanent
CMD_DOI = ':DOI,x,y\r'              # Digital Output Inactive Output x active for y milliseconds 0 for permanent
CMD_GDO = ':GDO,x\r'                # Get the satate of output x
CMD_GSV = ':GSV\r'                  # Get Module supply voltage


sockfd = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
sockfd.connect((DEVICE, 1))

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



