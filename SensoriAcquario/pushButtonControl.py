import RPi.GPIO as GPIO
import time
from common.MongoDbHandler import logEvent
from common.config import GPIOconfig

PortCfg = GPIOconfig()
GPIO.setmode(GPIO.BCM)

GPIO.setup(PortCfg['pushButton'], GPIO.IN, pull_up_down=GPIO.PUD_UP)
#GPIO.setup(21, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.setup(PortCfg['Lights'], GPIO.OUT)                  # PIN 23 PRESA BASSA

logEvent('INFO', 'pushButtonHandler', 'Script Boot', 'Script fired at the system boot')

while True:
    input_state = GPIO.input(PortCfg['pushButton'])
    if input_state == True:
        if(GPIO.input(PortCfg['Lights']) == 0):
            logEvent('INFO', 'pushButtonHandler', 'Manual Switch', 'Manual switch light to OFF')
            GPIO.output(PortCfg['Lights'], 1)
        else:
            GPIO.output(PortCfg['Lights'], 0)
            logEvent('INFO', 'pushButtonHandler', 'Manual Switch', 'Manual switch light to ON')
        time.sleep(0.7)
