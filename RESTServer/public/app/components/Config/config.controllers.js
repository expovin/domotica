'use strict';
angular.module('DomoHome')

	/* 	Controller per la gestione del menu navigazione su tutto il front-end di 
		configurazione
	*/
    .controller('navMenuConfigControllers', ['$scope','$location', function($scope,$location) {

        $scope.isActive = function (viewLocation) { 
            return $location.path().includes(viewLocation);
        };


    }])

    /*	Controller sul footer della sezione di configurazione
    */
    .controller('footerConfigControllers', ['$scope', function($scope) {


        
    }])


    /*	Controller utilizzato per la generazione e la gestione della lista di una 
    	"Collection" arbitraria
    */
    .controller('ListRowsController', ['$scope','sensorFactory', function($scope,sensorFactory) {

        /* Recupero la lista di Sensori censita a sistema*/
        $scope.sensori =  sensorFactory.getCollection('Sensori').query(
            function(response) {
                console.log('OK');
            },
            function(response){
                console.log('Errore')
            }
        )
    }])


    ;