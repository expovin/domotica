'use strict';
angular.module('DomoHome')

	/* 	Controller per la gestione del menu navigazione su tutto il front-end di 
		configurazione
	*/
    .controller('datarioControllers', ['$scope','$timeout', function($scope,$timeout) {

            $scope.clock = "loading clock..."; // initialise the time variable
            $scope.tickInterval = 1000 //ms

            var tick = function() {
                $scope.clock = Date.now() // get the current time
                $timeout(tick, $scope.tickInterval); // reset the timer
            }

            // Start the timer
            $timeout(tick, $scope.tickInterval);


    }])

    /*	Controller sul footer della sezione di configurazione
    */
    .controller('meteoControllers', ['$scope', function($scope) {


        
    }])


    /*	Controller utilizzato per la generazione e la gestione della lista di una 
    	"Collection" arbitraria
    */
    .controller('temperaturaControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {


    }])



    .controller('googleCalendarControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {


    }])


    .controller('temperaturaAcquarioControllers', ['$scope','sensorFactory', function($scope,sensorFactory) {


    }])
    ;