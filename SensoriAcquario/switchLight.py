import sys
import RPi.GPIO as GPIO
from common.MongoDbHandler import logEvent
from common.config import GPIOconfig

PortCfg = GPIOconfig()
#print str(sys.argv[1])
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(PortCfg['Lights'], GPIO.OUT)

if(str(sys.argv[1])=='ON'):
    logEvent('INFO', 'Switch Light', 'Switch Light ON', 'Scheduled action to switch the light ON')
    GPIO.output(PortCfg['Lights'], 0)

if(str(sys.argv[1])=='OFF'):
    logEvent('INFO', 'Switch Light', 'Switch Light OFF', 'Scheduled action to switch the light OFF') 
    print('Switch the light OFF')
    GPIO.output(PortCfg['Lights'], 1)


