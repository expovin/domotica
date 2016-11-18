'use strict';

angular.module('DomoHome')

.factory('chartLibFactory',[function() {
    var chart = {}; 

    chart.timeSeriesZoomable = function (data,cfg){



        var chartOpt = {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'USD to EUR exchange rate over time'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Exchange rate'
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: 'Temperatura rilevata',
                    data: data
                }]
        };

        for (var ele in cfg){
            console.log(ele+":"+JSON.stringify(cfg[ele])+" - "+JSON.stringify(chartOpt[ele]));
            chartOpt[ele] = cfg[ele];
        }

        Highcharts.chart('ChartContainer', chartOpt);
    }

    return chart;
}])

.factory('generalHelperLibFactory',[function() {	

	var helper = {};
	var numInnerCall = 0;
	
	/* 	Le due funzioni di aiuto successive verificano se un oggetto
		Obj e' un JSON Obj o un Array
	*/
    helper.isArray = function( obj ) { 
        return this.isObject(obj) && (obj instanceof Array);
    } 

    helper.isObject =function( obj ) {
        return obj && (typeof obj  === "object");
    }
    /*****************************************************************/

	/*	Questa funzione attraversa una struttura JSON con un algoritmo Depth First Search (DFS)
		La funzione chiama recursivamente se stessa quando incontra oggetti di tipo complesso
		come Array ed Object.
		Per la natura delle chiamate asincrone il modo per determinare quando il ciclo di chiamate 
		recursive termina viene usato un contatore sulle chiamate resursive <numInnerCall> inizializzato
		a zero, viene incrementato ad ogni chiamata recursiva (prima istruzione della funzione), e 
		decrementato alla fine della chiamata recursiva (fuori dal ciclo for). Il termine della visita
		di tutti i nodi sarà determinato dal valore 0 su <numInnerCall> (ultima chiamata recursiva terminata).
		In tal caso viene richiamata la callBack di fine visita.
		Ad ogni elemento foglia viene invece chiamata una callBack che ritorna il path assoluto della foglia
		visitata.

	*/

    helper.DFSTraverse = function myself (subSection,path, parentType, callbackLeaf, callbackEnd) {

    	// Contatore di chiamate recursive della funzione
    	numInnerCall +=1;									

    	// Ciclo sogli elementi di questo livello
        for (var key in subSection) {

        	// Verifica se l'elemento è un NODO o una FOGLIA
        	// se object caso NODO
            if(typeof(subSection[key]) == 'object') {
                var thisType;

                // Nel caso sia un elemento nodo, verifico se si tratta di
                // Un Array o un Object. Questa info servirà alla chiamata recursiva
                // successiva per utilizzare i separatori corretti nel path finale
                if(helper.isArray(subSection[key]))
                    thisType="Array";
                else
                    thisType="Obj";
                /************************************************************/

                // Verifico se l'oggetto corrente si trova in un Array o un Object
                // guardando il tipo del padre. In cao array utilizzo le parentesi quadre
                if (parentType=="Array")
                    myself(subSection[key],path+"["+key+"]",thisType,callbackLeaf, callbackEnd);
                else
                	//Nel caso di Object uso come separatore il punto
                    myself(subSection[key],path+"."+key,thisType, callbackLeaf, callbackEnd);
            }

            // Caso FOGLIA richiamo la callBack passando il path della foglia
            else{
            	callbackLeaf(path+"."+key);
    		}

    	}

    	// Fine del ciclo For, in questa sezione di codice arrivo ad ogni fine loop sugli
    	// elementi di un dato livello. Decremento numInnerCall e verifico se ho concluso anche
    	// l'ultimo livello (numInnerCall=0). In tal caso chiamo la callBack di uscita.
        numInnerCall --;
        if(numInnerCall == 0 && callbackEnd)
            callbackEnd();
        

	} 

	return helper;

   }])
;