'use strict';
angular.module('DomoHome')

	/* 	Controller per la gestione del menu navigazione su tutto il front-end di 
		configurazione
	*/
    .controller('datarioControllers', ['$scope','$timeout', function($scope,$timeout) {

        $scope.theme = 'dark';


    }])

    /*	Controller sul footer della sezione di configurazione
    */
    .controller('meteoControllers', ['$scope', function($scope) {


        
    }])


    /*	Controller utilizzato per la generazione e la gestione della lista di una 
    	"Collection" arbitraria
    */
    .controller('temperaturaControllers', ['$scope','sensorFactory','chartLibFactory', function($scope,sensorFactory,chartLibFactory) {
		
			$scope.changeTemp=false;

			$scope.toggleTempSwitch =  function(){
				$scope.changeTemp=!$scope.changeTemp;
			}
			
			
             sensorFactory.Sensore().get({ids:'57cc7e1fa712bbee2150133d'})
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


                sensorFactory.LettureSort().query({ids:'57cc7e1fa712bbee2150133d',Periodo:'201611'},
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
                        console.log('Errore')
                    }
                );

    }])



    .controller('googleCalendarControllers', ['$scope','eventsCalendarFactory', function($scope,eventsCalendarFactory) {

        var today = new Date();
        today.setHours(0,0,0,0);
        var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(0,0,0,0);
        var afterTomorrow = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
        afterTomorrow.setHours(0,0,0,0);

        console.log(today);
        console.log(tomorrow);
        console.log(afterTomorrow);

        var oggi = [];
        var domani = [];
        var futuri = [];

        $scope.nextEvents =  eventsCalendarFactory.EventCalendar().query({},
            function(response) {
                for(var event in response){

                    if(response[event].hasOwnProperty('start')){

                        if(response[event].start.hasOwnProperty('date')){
                            var dataEvento = new Date(response[event].start.date);
                        } 
                        else if (response[event].start.hasOwnProperty('dateTime'))
                            var dataEvento = new Date(response[event].start.dateTime);

                        if ((dataEvento>today) && (dataEvento<tomorrow)) {
                            console.log("Evento in data Odierna : "+dataEvento);
                            oggi.push(response[event]);

                        } else if ((dataEvento>tomorrow) && (dataEvento<afterTomorrow)) {
                            console.log("Evento schedulato per domani : "+dataEvento);
                            domani.push(response[event]);
                        } else if (dataEvento>afterTomorrow) {
                          console.log("Evento Futuro : "+dataEvento);
                          futuri.push(response[event])
                        }
                    }

                }
                $scope.Eventi={'Oggi':oggi, 'Domani':domani, 'Futuri':futuri};
                console.log($scope.Eventi);
                $scope.NumEventi = [$scope.Eventi.Oggi.length, $scope.Eventi.Domani.length, $scope.Eventi.Futuri.length];
                console.log($scope.NumEventi);
            },
            function(response){
                console.log('Errore')
            }
        );

    }])


    .controller('temperaturaAcquarioControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {


    }])
    ;