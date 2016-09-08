import os
import glob
import time
import RPi.GPIO as GPIO
from common.MongoDbHandler import * 
import SensorLibrary
from common.config import acquario
from common.config import GPIOconfig
import subprocess



GPIO.setmode(GPIO.BCM)
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir ='/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir +'28*')[0]
device_file = device_folder + '/w1_slave'
AcqCfg = acquario()
Gpio = GPIOconfig()
DELTA_TEMP = AcqCfg['getTemp']['Temp']['Delta Trigger']
CONSEC_READING = AcqCfg['getTemp']['Number of Consecutive Reading']
TIME_CONSEC_READING =  AcqCfg['getTemp']['Time Between Consecutive Reading']
TIME_BETWEEN_READING = AcqCfg['getTemp']['Interval Between Reading']
_ID_TEMP_ACQ="57ba13a90b5af92e0a000e56"

HEATER = Gpio['Heater']                # PIN in uscita che pilota l'accensione del riscaldatore
GPIO.setup(HEATER, GPIO.OUT)

logEvent('INFO', 'getWaterTemp', 'Script Boot', 'Script fired at the system boot')

def read_temp_raw_legacy():
    f = open(device_file,'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp_raw():
    catdata = subprocess.Popen(['cat',device_file], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = catdata.communicate()
    out_decode = out.decode('utf-8')
    lines = out_decode.split('\n')
    return lines
	
def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:]=='YES':
        time.sleep(0.2);
	lines = read_temp_raw()
	equals_pos = lines[1].find('t=')
	if(equals_pos != 1):
	    temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string)/1000.0
        return temp_c
		
while True:
    MIN_TEMP = AcqCfg['getTemp']['Temp']['Min']
    MAX_TEMP = AcqCfg['getTemp']['Temp']['Max']
    tempArray=[]
    for i in range (CONSEC_READING):
        tempArray.append(read_temp())
        time.sleep(TIME_CONSEC_READING)
    newArray = SensorLibrary.removeOutlayers(tempArray)
    temp_c=SensorLibrary.media(newArray)

    if(GPIO.input(HEATER)==0 ) and (temp_c > MIN_TEMP+DELTA_TEMP):
        logEvent('INFO', 'getWaterTemp', 'Heater Stop', 'Reached the upperbound temperature,("+str(temp_c)+") halt the heater')
        GPIO.output(HEATER, 1)

    if(GPIO.input(HEATER)==1) and (temp_c < MIN_TEMP-DELTA_TEMP):
         logEvent('INFO', 'getWaterTemp', 'Heater Start', 'Reached the lowerbound temperature,("+str(temp_c)+") start the heater')
         GPIO.output(HEATER, 0)

    recordTemp(temp_c,_ID_TEMP_ACQ)

    for t in range(int(TIME_BETWEEN_READING / 2)):
        if(os.path.isfile('stopGetTemp.tmp')):
            os.remove('stopGetTemp.tmp')
            logOut(2,FILE_NAME,"Stop controllato del processo stopGetTemp")
            logEvent('INFO', 'getWaterTemp', 'Heater Stop', 'RStop controllato processo acquisizione temperatura acquario')
            exit(0)

        time.sleep(2)

