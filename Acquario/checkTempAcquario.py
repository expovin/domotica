################################################################################
#  checkTempAcquario														   #
#  Questo programma viene lanciato periodicamente da Cron e si occupa di       #
#  prelevare la tempratura dell'acqua, registrarla, ed eventualmente azionare  #
#  gli attuatori per tenerla tra i range max e min							   #
################################################################################

from sensori import getTempDS18B20            # Lettura temperatura acqua
from attuatori import getStato, setStato      # Set e get stato HEATER
from config import acquario                   # Lettura configurazione Acquario
import logAction as LG                        # Importazione scrittura log
from os import path

FILE_NAME=path.basename(__file__)

# Setting Flag
SPENTO = 0
ACCESO = 1

# Lettura configurazione acquario
AcqCfg = acquario()                           
MIN_TEMP = AcqCfg['getTemp']['Temp']['Min']
MAX_TEMP = AcqCfg['getTemp']['Temp']['Max']
DELTA_TEMP = AcqCfg['getTemp']['Temp']['Delta Trigger']
DEBUG_LEVEL = AcqCfg['getTemp']['DebugLevel']

LG.setDbgLvl(DEBUG_LEVEL)

LG.logOut(5,FILE_NAME,"Letta configurazione Acquario. MIN_TMP: "+str(MIN_TEMP)\
	+" MAX_TEMP: "+str(MAX_TEMP)+" DELTA_TEMP : "+str(DELTA_TEMP))

# Acquisisco la temperatura attuale
temp = getTempDS18B20()
LG.logOut(4,FILE_NAME,"Acquisita temperatura: "+str(temp))

# Acquisisco lo stato del riscaldatore
heater = getStato("Heater")
LG.logOut(4,FILE_NAME,"Acquisito stato riscaldatore: "+str(heater))

# Se la temperatura sale al di sopra della minima (piu lo scarto) e il 
# riscaldatore e' acceso, allora viene spento
if(heater == ACCESO ) and (temp > MIN_TEMP+DELTA_TEMP):
    setStato("Heater",SPENTO)
    LG.logOut(3,FILE_NAME,"Temperatura minima raggiunta, Riscaldatore acceso ")

# Se la temperatura scende sotto la minima (meno lo scarto) e il riscaldatore
# e' spento, allora viene acceso
if(heater == SPENTO) and (temp < MIN_TEMP-DELTA_TEMP):
    setStato("Heater",ACCESO)
    LG.logOut(3,FILE_NAME,"Temperatura massima raggiunta, Riscaldatore spento ")
