import sys
from math import *

def media(array):
    sum=0
    for ele in array:
        sum +=ele
    return round(sum/len(array), 2)

def removeOutlayers(array):
    numEle = len(array);
    #print ("Array ricevuto : "+str(array))
    #print ("numero Elementi array : " + str(numEle))

    #Ordino l'array ricevuto
    array.sort();
    #print ("Array ordinato : "+str(array))

    #Calcolo la mediana
    if numEle % 2 == 1:
        Q2 = array[int(numEle/2)]
    else:
        Q2 = (array[int(numEle/2)] + array[int(numEle/2) -1]) / 2


    #print ("Mediana : "+ str(Q2))

    #Calcolo del primo Quartile
    if  (numEle / 2) % 2 == 1:
        Q1 = array[int(numEle/4)]
        Q3 = array[int(numEle/4 + numEle/2)]
    else:
        Q1 = (array[int(numEle/4)] + array[int(numEle/4) -1]) / 2
        Q3 = (array[int(numEle/4) + int(numEle/2)] + array[int(numEle/4) +int(numEle/2) -1]) / 2

    #print ("Primo Quartile : "+ str(Q1))
    #print ("Terzo Quartile : "+ str(Q3))

    #Calsolo scarto interquartile
    SI=(Q3-Q1)*1.5
    #print ("Scarto interquartile : "+ str(SI))

    #Calcolo Inner Face
    IFm = Q1-SI
    #print ("Inner Face minore: "+ str(IFm))
    IFM = Q3+SI
    #print ("Inner Face maggiore "+ str(IFM))

    #Costruisco il nuovo array
    newArray=[]
    for ele in array:
        if ele >= IFm and ele <= IFM:
            #print("Elemento "+str(ele)+" compreso, fa parte del nuovo array")
            newArray.append(ele)

    #print("Array da restituire "+str(newArray))
    return newArray

if __name__ == '__main__':
    print (media(removeOutlayers([71, 70, 73, 70, 70, 69, 70, 72, 71, 300, 71, 69])))

