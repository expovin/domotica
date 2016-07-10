import pymongo
import sys
import time

#Connect to the local  Server
connection = pymongo.MongoClient()

db = connection.domotica.config

c = db.find({})

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
