'use strict';
angular.module('DomoHome')


    .controller('navMenuConfigControllers', ['$scope', function($scope) {

        console.log("Sono nel navMenuConfig")

    }])

    .controller('footerConfigControllers', ['$scope', function($scope) {

        console.log("Sono nel footerConfigControllers")

    }])


    .controller('ListRowsController', ['$scope','sensorFactory', function($scope,sensorFactory) {

        /* Recupero la lista di Sensori censita a sistema*/
        $scope.sensori =  sensorFactory.Sensori().query(
            function(response) {
                console.log('OK');
            },
            function(response){
                console.log('Errore')
            }
        )


    }])

    .controller('DetailedRowsController', ['$scope', function($scope) {

        console.log("Sono nel footerConfigControllers")

    }])

    .controller('ReadingsSensorsController', ['$scope', function($scope) {

        console.log("Sono nel ReadingsSensorsController")

    }])
    ;