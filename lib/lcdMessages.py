################################################################################
#  lcdMessages.py															   #
#																			   #	
#  Questa funzione e' un automa a stati finiti che cicla sulle diverse 		   #
#  rappresentazioni dell'lcdMessages               							   #
################################################################################

import Adafruit_CharLCD as LCD 				# Libreria gestione LCD
import pymongo								# Connessione al database
from bson.objectid import ObjectId
from logAction import logOut				# Gestione Log
from os import path
import sys
import time

FILE_NAME=path.basename(__file__)

connection = pymongo.MongoClient()    # Connect to the local  Server
db = connection.domotica.Sensori 

###### Definizione ID Sensori #######################
TemperaturaSoggiorno = '57cc7e1fa712bbee2150133d'
UmiditaSoggiorno ='57cc7e7ca712bbee2150133f'
TemperaturaAcquario = '57cc7ed7a712bbee21501341'
UmiditaTerrenoPianta = '57cc7eaca712bbee21501340'
CrepuscolareSoggiorno = '57e2ec327e7df4f1a1942d93'
#####################################################
OperazioneInCorso = '57e2ede57e7df4f1a1942d94'
PosizioneCursore = '57e2f3487e7df4f1a1942d95'

####### Definizione della configurazione LCD ###################################
# Raspberry Pi pin configuration:
lcd_rs        = 25  	
lcd_en        = 24
lcd_d4        = 23
lcd_d5        = 17
lcd_d6        = 21
lcd_d7        = 22
lcd_backlight = 4

# Define LCD column and row size for 16x2 LCD.
lcd_columns = 16
lcd_rows    = 2

# Initialize the LCD using the pins above.
lcd = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7,
                           lcd_columns, lcd_rows, lcd_backlight)
################################################################################

VettoreStati = ['S0', 'S1', 'S3', 'A1']			# Stati dell'automa. Ogni stato 
										        # corrisponde ad una funzione

# Questa Funzione muove il cursore di visualizzazione su di un livello
# 0, 1, 2, 3, ...
def moveCursorUp():
    logOut(5,FILE_NAME,"Muovo il cursore su di una posizione")

    db = connection.domotica.StatoAttuale 
    POS = db.find_one({"_id" : ObjectId(PosizioneCursore)})
    logOut(5,FILE_NAME,"Posizione attuale "+str(POS['PosizioneAttuale']))
    _id=POS['_id']
    nextPos = (POS['PosizioneAttuale'] + 1) % len(VettoreStati) 
    logOut(5,FILE_NAME,"Posizione successiva "+str(nextPos))

    try:
        db.update({
          "_id" : _id,  
        },{
          '$set' : {
            'PosizioneAttuale' : nextPos
          }
        },upsert=False)
    except:
    	logOut(0,FILE_NAME,"Errore update DB :"+str(sys.exc_info()[0]))

    globals()[VettoreStati[nextPos]]()


# Questa Funzione muove il cursore di visualizzazione giu di un livello
# ..., 3, 2, 1, 0
def moveCursorDown():
    logOut(5,FILE_NAME,"Muovo il cursore giu di una posizione")

    db = connection.domotica.StatoAttuale 
    POS = db.find_one({"_id" : ObjectId(PosizioneCursore)})
    logOut(5,FILE_NAME,"Posizione attuale "+str(POS['PosizioneAttuale']))
    _id=POS['_id']
    nextPos = (POS['PosizioneAttuale'] - 1) % len(VettoreStati) 
    logOut(5,FILE_NAME,"Posizione successiva "+str(nextPos))

    try:
        db.update({
          "_id" : _id,  
        },{
          '$set' : {
            'PosizioneAttuale' : nextPos
          }
        },upsert=False)
    except:
        logOut(0,FILE_NAME,"Errore update DB :"+str(sys.exc_info()[0]))

    globals()[VettoreStati[nextPos]]()

# Primo stato dell'automa. In questo stato viene mostrata la temperatura e
# l'umidita' ambientale
def S0():
    logOut(5,FILE_NAME,"Stato S0, connessione al DB Sensori")

    T = db.find_one({"_id" : ObjectId(TemperaturaSoggiorno)})
    U = db.find_one({"_id" : ObjectId(UmiditaSoggiorno)})

    lcd.clear()
    lcd.message('Temp Amb  '+str(T['ultimaLettura'])+' C\n'\
		        'Umid Amb    '+str(U['ultimaLettura'])+' %')

# Secondo stato automa. In questo stato viene mostrato Temperatura ambiente e
# temperatura acquario
def S1():
    logOut(5,FILE_NAME,"Stato S1, connessione al DB Sensori")

    T = db.find_one({"_id" : ObjectId(TemperaturaSoggiorno)})
    A = db.find_one({"_id" : ObjectId(TemperaturaAcquario)})

    lcd.clear()
    lcd.message('Ambiente  '+str(T['ultimaLettura'])+' C\n'\
		        'Acquario   '+str(A['ultimaLettura'])+' %')

# Terzo stato dell'automa. In questo stato viene mostrato Stato umidita terra e
# livello luce
def S2():
    logOut(5,FILE_NAME,"Stato S1, connessione al DB Sensori")

    UT = db.find_one({"_id" : ObjectId(UmiditaTerrenoPianta)})
    LU = db.find_one({"_id" : ObjectId(CrepuscolareSoggiorno)})

    lcd.clear()
    lcd.message('Pianta      '+str(UT['ultimaLettura'])+'\n'\
		        'Luce         '+str(LU['ultimaLettura'])+'')

# In questo stato viene mostrata data e ora attuale
def S3():
    logOut(5,FILE_NAME,"Stato S3, connessione al DB Sensori")

    data = time.strftime("%d/%m/%Y")
    ora = time.strftime("%H:%M")
    giorno = time.strftime("%a")

    lcd.clear()
    lcd.message('      '+data+'\n'+giorno+"        "+ora)

# Quarto stato dell'automa, in questo stato viene mostrato le attivita in corso
def A1():
    logOut(5,FILE_NAME,"Stato A1, connessione al DB Sensori")

    db = connection.domotica.StatoAttuale 

    MSG = db.find_one({"_id" : ObjectId(OperazioneInCorso)})

    lcd.clear()
    lcd.message(MSG['riga1']+'\n'+MSG['riga2'])


if __name__ == '__main__':
    S3()
		        
