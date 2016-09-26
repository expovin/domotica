import RPi.GPIO as GPIO
import time


for i in range(3):
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(5,GPIO.OUT) 

    GPIO.output(5,1)
    time.sleep(0.4)
    GPIO.cleanup()
    time.sleep(1)
