'use strict';

angular.module('DomoHome.config.sensors')


    .controller('ListRowsController', ['$scope', function($scope) {

    	console.log("Sono nel ListRowsController")

    }])

    .controller('DetailedRowsController', ['$scope', function($scope) {

    	console.log("Sono nel footerConfigControllers")

    }])

    .controller('ReadingsSensorsController', ['$scope', function($scope) {

    	console.log("Sono nel ReadingsSensorsController")

    }])
    ;