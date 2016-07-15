from logAction import *
import sys

def miaFunc(rc):
    logOut("INFO","FileTest","Messaggio da dentro miaFunc")
    sys.exit(0)


logOut("INFO","FileTest","Avvio MiaFunc")
miaFunc(-2)
