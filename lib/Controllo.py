import RPi.GPIO as GPIO
from logAction import *
from os import path
from attuatori import getStato,setStato
import sys

FILE_NAME=path.basename(__file__)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO_HEATER = 17;			# Porta GPIO Heater
GPIO_COOLER = 18;			# Porta GPIO Cooler

# CONTROLLO TEMPERATURA IN RANGE
# Questa funzione attiva tiene sotto controllo una temperatura tra il suo valore
# minimo e massimo attivando o disattivando una porta del GPIO (dove dovra essere
# connesso un attuatore riscaldatore).
# Per evitare repentine accensioni e spegnimenti dell'attuatore quando prossimo
# alla soglia, viene fornito anche la soglia di isteresi (SI) che e' il valore 
# entro il quale l'attuatore non viene azionato/spento.
# Es. Temperaatura minima da controllare 22 C con SI=1 C.
#   - Nel caso in cui la temperatura diminuisca partendo da un valore di 23 
#     gradi, l'attuatore viene acceso solo a 21 C (22 - 1).
#   - L'attuatore rimarra acceso fino al raggiungimento dei 23 C (22 + 1)
# Vengono a crearsi quindi 4 diverse soglie, che dividono 5 zone, a cui 
# corrispondono 4 azioni su due attuatori.  I due attuatori sono:
#	- Riscaldatore (HEATER)
#	- Raffreddatore (COOLER)
# Le 4 soglie/azioni sono:
#   - Accensione Riscaldatore   --> HEATER_ON = tmin - SI
#   - Spegnimento Riscaldatore  --> HEATER_OFF = tmin + SI
#   - Accensione Raffreddatore  --> COOLER _ON = tmax + SI
#   - Spegnimento Raffreddatore --> COOLER_OFF = tmax - SI

def ControlloSoglia(	gMisurata, 			# Grandezza realmente misurata
						gSoglia, 			# Grandezza minima accettata (-SI)
						SI,        			# Soglia di isteresi

                        gSet,               # Azzione da attuare al rggiungimento soglia
                                            #   0 : Disattivazione device
                                            #   1 : Attivazione device 

						gDEVICE):	        # ID Device su grandezza minima


#    HEATER_DEVICE = '5806408844a90f4f5500dafe';
#    COOLER_DEVICE = '58064b9044a90f4f5500daff';
    # Controllo lo stato attuale dei dispositivi (Device)
    sDEVICE = getStato(gDEVICE); 	# Stato Heater

    logOut(3,FILE_NAME,"Modulo Controllo Soglia Lineare");
    logOut(3,FILE_NAME,"Grandezza Letta : "+str(gMisurata));


    logOut(4,FILE_NAME,"Controllo grandezza soglia : "+str(gSoglia));
    logOut(4,FILE_NAME,"Device da azionare : "+str(gDEVICE));
    logOut(4,FILE_NAME,"Azione impostata : "+str(gSet));
    logOut(4,FILE_NAME,"Soglia Isteresi : "+str(SI));

    #Calcolo le 4 soglie
    gDEVICE_ON  = gSoglia - SI;
    gDEVICE_OFF = gSoglia + SI;


    logOut(3,FILE_NAME,"gDEVICE_ON  : "+str(gDEVICE_ON));
    logOut(4,FILE_NAME,"gDEVICE_OFF : "+str(gDEVICE_OFF));


    # Controllo zone
    if(gMisurata < gDEVICE_ON): # ZONA 1
        logOut(3,FILE_NAME,"ZONA 1 accensione device controllo soglia");
        setStato(gDEVICE,gSet);

    elif ((gMisurata >= gDEVICE_ON) and (gMisurata <= gDEVICE_OFF)):
    	logOut(4,FILE_NAME,"ZONA 2. Lascio lo stato del device inanlterato");


    elif(gMisurata > gDEVICE_OFF):
        logOut(4,FILE_NAME,"ZONA 3 spegnimento device controllo soglia");
        setStato(gDEVICE,not(gSet));




if __name__ == "__main__":
    ControlloSoglia(float(sys.argv[1]), float(sys.argv[2]), 
    				float(sys.argv[3]), bool(sys.argv[4]), sys.argv[5], 
                    );

