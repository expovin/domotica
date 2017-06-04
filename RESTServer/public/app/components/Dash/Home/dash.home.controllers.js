'use strict';
angular.module('DomoHome')

	/* 	Controller per la gestione del menu navigazione su tutto il front-end di 
		configurazione
	*/
    .controller('datarioControllers', ['$scope','$timeout', function($scope,$timeout) {

        $scope.theme = 'dark';


        
        $scope.isToday = function(day) {
            var d = new Date();
            var n = d.getDay();
            if(day==n) {
                return(true);
            }
            return(false);

            
        }
    }])

    /*	Controller sul footer della sezione di configurazione
    */
    .controller('meteoControllers', ['$scope', function($scope) {


        
    }])


    .controller('MensaBimbiControllers', ['$scope','webAccountFactory','chartLibFactory', 
    function($scope,webAccountFactory,chartLibFactory) {

        webAccountFactory.getBuoniPastoAli().get()
                 .$promise.then(
                    //success
                    function( value ){
                        console.log("Mensa ALice Saldo: "+value.Saldo);
                        console.log("Costo: "+value.Refezione);
                        var Qta = value.Saldo/value.Refezione;
                        var perc = Qta/20*100;
                        console.log("Numero: "+Qta);
                        $scope.buoniAli  = value;
                        $scope.buoniAli['qta']=Qta;
                        $scope.buoniAli['perc']=perc;

                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  );

        webAccountFactory.getBuoniPastoGian().get()
                 .$promise.then(
                    //success
                    function( value ){
                        console.log("Mensa Gianluca Saldo: "+value.Saldo);
                        console.log("Costo: "+value.Refezione);
                        var Qta = value.Saldo/value.Refezione;
                        var perc = Qta/20*100;
                        console.log("Numero: "+Qta);
                        $scope.buoniGia  = value;
                        $scope.buoniGia['qta']=Qta;
                        $scope.buoniGia['perc']=perc;

                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  );



    }])
    /*	Controller utilizzato per la generazione e la gestione della lista di una 
    	"Collection" arbitraria
    */
    .controller('temperaturaControllers', ['$scope','sensorFactory','chartLibFactory', 
        function($scope,sensorFactory,chartLibFactory) {
		
			$scope.changeTemp=false;

			$scope.toggleTempSwitch =  function(){
				$scope.changeTemp=!$scope.changeTemp;
			}
			
			
             sensorFactory.Sensore1().get({ids:'57cc7e1fa712bbee2150133d'})
                 .$promise.then(
                    //success
                    function( value ){
                        console.log(value);
                        $scope.result  = value;

                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  );


                sensorFactory.LettureSort().query({ids:'57cc7ed7a712bbee21501341',Periodo:'201705'},
                    function(response) {
                       var data=[];
                       $scope.letture =  response;
                       
                       for(var ele in response){
                            var point=[];
                            if(response[ele].hasOwnProperty('Letture')){
                                var now = new Date(response[ele].Letture.DataPrimoInserimento);

                                var now_utc = Date.UTC( now.getFullYear(), 
                                                        now.getMonth(), 
                                                        now.getDate(),  
                                                        now.getHours(), 
                                                        now.getMinutes(), 
                                                        now.getSeconds());

                                point.push(now_utc);
                                point.push(response[ele].Letture.lettura);
                                data.push(point);
                            }
                       }

                       var cfg={
                            title: {
                                text: 'Temperatura interna'
                            },
                            subtitle: {},
                            yAxis: {}
                       };

                       chartLibFactory.timeSeriesZoomable(data,cfg);      
                    },
                    function(response){
                        console.log('Errore : '+response);
                    }
                );

    }])



    .controller('googleCalendarControllers', ['$scope','eventsCalendarFactory', function($scope,eventsCalendarFactory) {

        function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        $scope.nextEvents =  eventsCalendarFactory.EventCalendar().query({},
            function(response) {

                var eventi = [];
                var days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
                var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
                var keyPrec ="";
                var Calendar={};
                response.forEach(function(eventoCal){
                    var evento={'start':{}, 'end':{}};
                    var allDayS=false ;


                    if(eventoCal.start.hasOwnProperty('date')){
                        var dataEventoS = new Date(eventoCal.start.date);
                        allDayS = true;
                    } 
                    else if (eventoCal.start.hasOwnProperty('dateTime'))
                        var dataEventoS = new Date(eventoCal.start.dateTime);

                    /* Chiave Evento. Rappresenta tutti gli eventi in un giorno */
                    var key=dataEventoS.getFullYear()+pad(dataEventoS.getMonth(),2)+pad(dataEventoS.getDate(),2);

                    if(key != keyPrec){
                        eventi = [];
                        var giorno={};
                        giorno['Day']=dataEventoS.getDate();
                        giorno['Month']=months[dataEventoS.getMonth()];
                        giorno['Year']=dataEventoS.getFullYear();
                        giorno['wDay']=days[dataEventoS.getDay()];
                        if ((dataEventoS.getDay() == 0) || (dataEventoS.getDay() == 6))
                            giorno['isWE']=true;
                        else
                            giorno['isWE']=false;
                        Calendar[key]=giorno;
                    }
                    keyPrec=key;

/*
                    evento['start']['Day']=dataEventoS.getDate();
                    evento['start']['Month']=months[dataEventoS.getMonth()];
                    evento['start']['Year']=dataEventoS.getFullYear();
                    evento['start']['wDay']=days[dataEventoS.getDay()];
*/
                    if(!allDayS){
                        evento['start']['Time']=pad(dataEventoS.getHours(),2)+':'+pad(dataEventoS.getMinutes(),2);
                        evento['allDay']=false;
                    }
                    else
                        evento['allDay']=true

                    if(eventoCal.end.hasOwnProperty('date')){
                        var dataEventoE = new Date(eventoCal.end.date);
                    } 
                    else if (eventoCal.end.hasOwnProperty('dateTime'))
                        var dataEventoE = new Date(eventoCal.end.dateTime);
/*
                    evento['end']['Day']=dataEventoE.getDate();
                    evento['end']['Month']=months[dataEventoE.getMonth()];
                    evento['end']['Year']=dataEventoE.getFullYear();
                    evento['end']['wDay']=days[dataEventoE.getDay()];
*/
                    evento['end']['Time']=pad(dataEventoE.getHours(),2)+':'+pad(dataEventoE.getMinutes(),2);


                    evento['summary']=eventoCal.summary;
                    evento['location']=eventoCal.location;

                    eventi.push(evento);
        
                    Calendar[key]['eventi']=eventi;

                });
                $scope.giorni=Calendar;
                console.log($scope.giorni);
            },   
            
            function(response){
                console.log('Errore')
            }
        );
    }])


    .controller('temperaturaAcquarioControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {


    }])
    ;