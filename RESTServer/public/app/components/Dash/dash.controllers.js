'use strict';
angular.module('DomoHome')

	/* 	Controller per la gestione del menu navigazione su tutto il front-end di 
		configurazione
	*/
    .controller('iconWarningBarControllers', ['$scope','$location', function($scope,$location) {



    }])

    /*	Controller sul footer della sezione di configurazione
    */
    .controller('DashMainPageControllers', ['$scope', function($scope) {


        
    }])


    /*	Controller utilizzato per la generazione e la gestione della lista di una 
    	"Collection" arbitraria
    */
    .controller('NavigationControllers', ['$scope','$location', function($scope,$location) {

            var audio = new Audio('audio/Button_1.wav');
            audio.play();
                
        $scope.playAudio =  function(){
            console.log("Bottone Cliccato!")



        }

        $scope.isActive = function (viewLocation) { 
            return $location.path().includes(viewLocation);
        };

    }])


    ;