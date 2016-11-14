################################################################################
#  config.py                                                                   #
#                                                                              #
#  Questa funzione legge la configurazione in JSON da MongoDB, ogni metodo     #
#  ritorna la sottoparte del JSON relativa                                     #
################################################################################
import pymongo
import sys
import time             # Questa e da cancellare

#Connect to the local  Server
connection = pymongo.MongoClient()

dbc = connection.domotica.config

# Risultato della find (assumo che la collection abbia solo un documento)
c = dbc.find({'General.Tag' : 'Current'})

def general():
	return c[0]['General']

def acquario():
    return c[0]['Acquario']

def GPIOconfig():
    return c[0]['GPIO']

def weather():
    return c[0]['WeatherInfo']

def irrigazione():
    return c[0]['Irrigazione']

def mail():
    return c[0]['Email'] 
