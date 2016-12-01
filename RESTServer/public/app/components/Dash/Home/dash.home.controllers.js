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
                                point.push(response[ele].Letture.lettura)

                                console.log(point);
                                data.push(point);
                            }
                       }
                       console.log(data);

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

        $scope.nextEvents =  eventsCalendarFactory.EventCalendar().query({},
            function(response) {
                console.log('Recuperate Eventi');        
            },
            function(response){
                console.log('Errore')
            }
        );

    }])


    .controller('temperaturaAcquarioControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {


    }])
    ;