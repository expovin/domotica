################################################################################
#  Attuatori.py
#  Questa funzione mette a fattor comune la gestione degli stati di tutti gli  #
#  attuatori. Le schede rele sono state divise in famiglie di attuatori ed sono#
#  indirizzate con funzioni specifiche dal nome Tipo presente nel catalogo     #
#  degli attuatri
################################################################################
import RPi.GPIO as GPIO
import pymongo
from bson.objectid import ObjectId
import bt004 as BT
import logAction as LG
import sys
from DBHandler import logEvent
from os import path
import argparse

# Nome di questo file 
FILE_NAME=path.basename(__file__)

# Configurazione connessione locale Mongo
connection = pymongo.MongoClient()
# Utilizzo della Collection catalogo degli attuatori
db=connection.domotica.Dispositivi
db1=connection.domotica.Attuatori
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Funzione di gestione degli attuatori connessi ai PIN del GPIO. Per questi
# attuatori e' sufficente modificare lo stato del PIN di uscita
def PN(appli, stato):
    PinOut=int(appli['GPIO'])                # Recupero il numero PIN del GPIO
    LG.logOut(5,FILE_NAME,"Pin da modificare "+str(PinOut))

    GPIO.setup(PinOut,GPIO.OUT)         # Setto il pin in uscita WARNING
    GPIO.output(PinOut,stato)			# Imposto il Pin allo stato richiesto

def BT(appli, stato):
	Port=appli['Porta']					# Recupero il numero di porta
	LG.logOut(5,FILE_NAME,"Porta da modificare "+str(Port))

	if (stato==1):						# Verifico se attivarla o disattivarla
		BT.ActivePort(str(Port),"0")	# Lo 0 indica il tempo (infinito) per
	else:								# lo switch
	    BT.InactivePort(str(Port),"0")


# La funzione setStato reperisce dal catalogo degli attuatori tutti i dettagli
# cercando l'attuatore per appliance collegato. Verifica il tipo di attuatore e
# richiama la funzione di gestione (Stesso nome del tipo attuatore)
def setStato(appliance,stato):
    LG.logOut(4,FILE_NAME,"Richiesta di cambio stato per appliance : "+appliance\
		+" nuovo stato :"+str(stato))
    appli = db.find_one({'_id':ObjectId(appliance)})
    stato=int(stato)

    LG.logOut(4,FILE_NAME,"Recuperato Appliance : "+appli['Dispositivo'])

    Attuatore=db1.find_one({'_id':ObjectId(appli['AttuatoreId'])})				# Recupero il tipo attuatore
    Tipo=Attuatore['Prefix']
    LG.logOut(5,FILE_NAME,"Trovato tipo appliance "+Tipo)
    

    globals()[Tipo](appli,stato)		# Richiamo della funzione di gestione

    if(Attuatore['TracciaStoria'] == 1):
        logEvent('INFO', appliance, stato, "Cambio stato ")
    

def PNGet(appli):
    PinOut=int(appli['GPIO'])
    GPIO.setup(PinOut,GPIO.OUT)
    stato=GPIO.input(PinOut)
    LG.logOut(5,FILE_NAME,"Lo stato PIN "+str(PinOut)+" e': "+str(stato))	
    return (stato)


def getStato(appliance):
    appli = db.find_one({'_id':ObjectId(appliance)}) 

    Attuatore=db1.find_one({'_id':ObjectId(appli['AttuatoreId'])})

    Tipo=Attuatore['Prefix']
    return (globals()[Tipo+"Get"](appli))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Aziona e verifica stato attuatori')
    parser.add_argument('Azione', help='getStato | setStato')
    parser.add_argument('Appliance', help='Nome da modificare o verificare')
    parser.add_argument('--stato', help='Necessaria con setStato, nuovo stato appliance',type=int)
    args=parser.parse_args()
    #parser.print_help()

    if(args.Azione == "getStato"):
        s=getStato(args.Appliance)
        print("Stato : "+str(s))
    else:
        setStato(args.Appliance,args.stato)

    #globals()[sys.argv[1]](sys.argv[2],sys.argv[3])

