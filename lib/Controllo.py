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

def TemperaturaRange(	tmp, 			# Temperatura realmente misurata
						tmin, 			# Temperatura minima accettata (-SI)
						tmax, 			# Temperatura massima accettata (+SI)
						SI,  			# Soglia di isteresi
						HEATER_DEVICE,	# ID Device per aumentare temperatura
						COOLER_DEVICE): # ID Device per diminuire temperatura

#    HEATER_DEVICE = '5806408844a90f4f5500dafe';
#    COOLER_DEVICE = '58064b9044a90f4f5500daff';
    # Controllo lo stato attuale dei dispositivi (Device)
    HEATER = getStato(HEATER_DEVICE); 	# Stato Heater
    COOLER = getStato(COOLER_DEVICE); 	# Stato Cooler
    ON=1;
    OFF=0;

    logOut(3,FILE_NAME,"Modulo Controllo Temperatura in Range");
    logOut(3,FILE_NAME,"Temperatura Letta : "+str(tmp));
    logOut(4,FILE_NAME,"Temperatura minima : "+str(tmin));
    logOut(4,FILE_NAME,"Temperatura massima : "+str(tmax));
    logOut(4,FILE_NAME,"Soglia Isteresi : "+str(SI));

    #Calcolo le 4 soglie
    HEATER_ON  = tmin - SI;
    HEATER_OFF = tmin + SI;
    COOLER_ON  = tmax + SI;
    COOLER_OFF = tmax - SI;

    logOut(3,FILE_NAME,"HEATER_ON  : "+str(HEATER_ON));
    logOut(4,FILE_NAME,"HEATER_OFF : "+str(HEATER_OFF));
    logOut(4,FILE_NAME,"COOLER_ON  : "+str(COOLER_ON));
    logOut(4,FILE_NAME,"COOLER_OFF : "+str(COOLER_OFF));


    # Controllo zone
    if(tmp < HEATER_ON): # ZONA 1
        logOut(3,FILE_NAME,"ZONA 1 accensione riscaldatore ");
        setStato(HEATER_DEVICE,ON);
        setStato(COOLER_DEVICE,OFF);

    elif ((tmp >= HEATER_ON) and (tmp < HEATER_OFF)):
    	logOut(4,FILE_NAME,"ZONA 2 controllo stato dispositivi, HEATER : "+
    		str(HEATER)+" COOLER : "+str(COOLER));

    	if(COOLER == ON):
    		logOut(3,FILE_NAME,"COOLER attivo. Spengo tutto");
    		setStato(HEATER_DEVICE,OFF);
    		setStato(COOLER_DEVICE,OFF);

    elif((tmp >= HEATER_OFF) and (tmp < COOLER_OFF)):
        logOut(4,FILE_NAME,"ZONA 3 tutti i dispositivi vengono spenti");

        setStato(HEATER_DEVICE,OFF);
        setStato(COOLER_DEVICE,OFF);

    elif((tmp >= COOLER_OFF) and (tmp < COOLER_ON)):
    	logOut(4,FILE_NAME,"ZONA 4 controllo stato dispositivi, HEATER : "+
    		str(HEATER)+" COOLER : "+str(COOLER));

    	if(HEATER == ON):
    		logOut(3,FILE_NAME,"HEATER attivo. Spengo tutto");
    		setStato(HEATER_DEVICE,OFF);
    		setStato(COOLER_DEVICE,OFF);

    elif(tmp >= COOLER_ON):
        logOut(4,FILE_NAME,"ZONA 5 accendo raffreddatore");
        setStato(HEATER_DEVICE,OFF);
        setStato(COOLER_DEVICE,ON);



if __name__ == "__main__":
    TemperaturaRange(float(sys.argv[1]), float(sys.argv[2]), 
    				float(sys.argv[3]), float(sys.argv[4]),
    				sys.argv[5], sys.argv[6]);