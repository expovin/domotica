import RPi.GPIO as GPIO
import dht11
import sys
import Adafruit_ADS1x15
import os
import subprocess
import glob
import time
from DBHandler import recordLettura

# initialize GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir ='/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir +'28*')[0]
device_file = device_folder + '/w1_slave'

NUM_LETTURE_CONSECUTIVE = 10
DHT11_PIN=18

# Create an ADS1115 ADC (16-bit) instance.
adc = Adafruit_ADS1x15.ADS1115()

# Lettura valori di temperatura da sensore TMP36
def getTemp_TMP36(ch):
    temp_c = [0] * NUM_LETTURE_CONSECUTIVE
    _id= [0] * 4
    _id[0] = '57cc7e42a712bbee2150133e'  # Sensore interno
    _id[3] = '57cc7e1fa712bbee2150133d'  # Sensore esterno

    for i in range(NUM_LETTURE_CONSECUTIVE):
         #value = adc.read_adc(int(ch), gain=4)
         milliv = value * ( 33 / 1024.0 )
         temp_c[i]=((milliv - 500.0) /10)
         time.sleep(0.2)
         
    tmp = removeOutlayers(temp_c)
    tmp = float("{0:.1f}".format(tmp))

    recordLettura(tmp,_id[ch])

    return(tmp)

# Lettura dei valori dell'umidita terra
def getMoisture():
    _id='57cc7eaca712bbee21501340'

    value = [0] * NUM_LETTURE_CONSECUTIVE

    for i in range (NUM_LETTURE_CONSECUTIVE):
        value[i] = adc.read_adc(1, gain=2)
        #time.sleep(2)
        #milliv[i] = value * ( 33 / 1024.0 )

    valueAvg = removeOutlayers(value)
    perc = valueAvg * 100.0 / 32768.0
    perc = float("{0:.1f}".format(perc))

    recordLettura(perc,_id)
    return perc


def getHumidity_DHT11():
    _id='57cc7e7ca712bbee2150133f'
    instance = dht11.DHT11(pin=DHT11_PIN)
    H = [0] * NUM_LETTURE_CONSECUTIVE

    for i in range(NUM_LETTURE_CONSECUTIVE):
        result = instance.read()
        if result.is_valid():
            H[i] = result.humidity

        time.sleep(0.2)

    HAvg = removeOutlayers(H)

    recordLettura(HAvg,_id)

    return(HAvg)

#################### Funzioni per lettura Sensore DS18D20 ######################
def read_temp_raw_legacy():
    f = open(device_file,'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp_raw():
    catdata = subprocess.Popen(['cat',device_file], stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE)

    out, err = catdata.communicate()
    out_decode = out.decode('utf-8')
    lines = out_decode.split('\n')
    return lines

def getTempDS18B20():
    _id='57cc7ed7a712bbee21501341'
    lines = read_temp_raw()
    while lines[0].strip()[-3:]=='YES':
        time.sleep(0.2);
        lines = read_temp_raw()
        equals_pos = lines[1].find('t=')
        if(equals_pos != 1):
            temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string)/1000.0

        recordLettura(temp_c,_id)
        return temp_c
################################################################################



# Questa funzione prende un Array arbitrario di valori, rimuove gli Outlayers
# e restituisce la media dei valori rimanenti

def removeOutlayers(array):
    numEle = len(array);
    #print ("Array ricevuto : "+str(array))
    #print ("numero Elementi array : " + str(numEle))

    #Ordino l'array ricevuto
    array.sort();
    #print ("Array ordinato : "+str(array))

    #Calcolo la mediana
    if numEle % 2 == 1:
        Q2 = array[int(numEle/2)]
    else:
        Q2 = (array[int(numEle/2)] + array[int(numEle/2) -1]) / 2


    #print ("Mediana : "+ str(Q2))

    #Calcolo del primo Quartile
    if  (numEle / 2) % 2 == 1:
        Q1 = array[int(numEle/4)]
        Q3 = array[int(numEle/4 + numEle/2)]
    else:
        Q1 = (array[int(numEle/4)] + array[int(numEle/4) -1]) / 2
        Q3 = (array[int(numEle/4) + int(numEle/2)] + array[int(numEle/4) +
            int(numEle/2) -1]) / 2

    #print ("Primo Quartile : "+ str(Q1))
    #print ("Terzo Quartile : "+ str(Q3))

    #Calsolo scarto interquartile
    SI=(Q3-Q1)*1.5
    #print ("Scarto interquartile : "+ str(SI))

    #Calcolo Inner Face
    IFm = Q1-SI
    #print ("Inner Face minore: "+ str(IFm))
    IFM = Q3+SI
    #print ("Inner Face maggiore "+ str(IFM))

    #Costruisco il nuovo array
    newArray=[]
    for ele in array:
        if ele >= IFm and ele <= IFM:
            #print("Elemento "+str(ele)+" compreso, fa parte del nuovo array")
            newArray.append(ele)

    #print("Array da restituire "+str(newArray))
    return media(newArray)


def media(array):
    sum=0
    for ele in array:
        sum +=ele
    return round(sum/len(array), 2)

