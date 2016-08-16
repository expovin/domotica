import RPi.GPIO as GPIO
import time
import os
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
    time.sleep(0.2)
    if input_state == True:
        if(GPIO.input(PortCfg['Lights']) == 0):
            logEvent('INFO', 'pushButtonHandler', 'Manual Switch', 'Manual switch light to OFF')
            GPIO.output(PortCfg['Lights'], 1)
        else:
            print("Accendo la luce")
            GPIO.output(PortCfg['Lights'], 0)
            logEvent('INFO', 'pushButtonHandler', 'Manual Switch', 'Manual switch light to ON')
<<<<<<< HEAD

        time.sleep(0.7)

    if(os.path.isfile('stopPushButton.tmp')):
        os.remove('stopPushButton.tmp')
        logOut(2,FILE_NAME,"Stop controllato del processo")
        exit(0)

    
=======
    time.sleep(0.7)
>>>>>>> 9760522bad10f38b132b6f0d2943f2a647e785af
