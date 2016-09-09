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
c = dbc.find({'Tag' : 'Current'})

def general():
	return c[0]['general']

def acquario():
    return c[0]['Acquario']

def GPIOconfig():
    return c[0]['GPIO']

def weather():
    return c[0]['Weather Info']

def irrigazione():
    return c[0]['Irrigazione']

def mail():
    return c[0]['email'] 
