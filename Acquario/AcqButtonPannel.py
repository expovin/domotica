import RPi.GPIO as GPIO
import pymongo
import logAction as LG
from os import path
import lcdMessages as lcd

# Nome di questo file 
FILE_NAME=path.basename(__file__)

# Configurazione connessione locale Mongo
connection = pymongo.MongoClient()

db=connection.domotica.Attuatori

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Definizione porte utilizzate
LuceAcquario = db.find_one({'ApplianceCollegato':'Luce Acquario','Tipo':'PB'})
cursorUp = db.find_one({'ApplianceCollegato':'displayMoveCursorUp','Tipo':'HPB'})
cursorDown = db.find_one({'ApplianceCollegato':'displayMoveCursorDown','Tipo':'HPB'})
################################################################################

GPIO.setup(LuceAcquario['GPIO'], GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(cursorUp['GPIO'], GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(cursorDown['GPIO'], GPIO.IN, pull_up_down=GPIO.PUD_UP)

# GPIO 24 set up as an input, pulled down, connected to 3V3 on button press  
GPIO.setup(27, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) 

def FunLuceAcquario(channel):
	LG.logOut(2,FILE_NAME,'Cambiato stato luce acquario')

def FunCursorUp(channel):
	LG.logOut(2,FILE_NAME,'Cambiato stato cursorUp')
	lcd.moveCursorUp()

def FunCursorDown(channel):
	LG.logOut(2,FILE_NAME,'Cambiato stato cursorDown')
	lcd.moveCursorDown()

GPIO.add_event_detect(LuceAcquario['GPIO'], GPIO.FALLING, callback=FunLuceAcquario, bouncetime=300)
GPIO.add_event_detect(cursorUp['GPIO'], GPIO.FALLING, callback=FunCursorUp, bouncetime=300)
GPIO.add_event_detect(cursorDown['GPIO'], GPIO.FALLING, callback=FunCursorDown, bouncetime=300)

try:
    print "Waiting for rising edge on port 24"
    GPIO.wait_for_edge(27, GPIO.RISING)
    print "Rising edge detected on port 24. Here endeth the third lesson."

except KeyboardInterrupt:
    GPIO.cleanup()       # clean up GPIO on CTRL+C exit  ^M
GPIO.cleanup()   