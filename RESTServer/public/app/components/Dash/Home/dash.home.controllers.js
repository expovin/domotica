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
    .controller('temperaturaControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {

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
                  )

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