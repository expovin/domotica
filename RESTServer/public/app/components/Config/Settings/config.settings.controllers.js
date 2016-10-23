'use strict';

angular.module('DomoHome') 

    .controller('SettingsControllers', ['$scope','configFactory', '$location',
        function($scope,configFactory,$location) {

        var config = {};
        $scope.sections = {};
        var save = {};

        $scope.alertMessage = {};


        $scope.alertMessage = {
            "show" : true,
            "type" : "danger",
            "glyphicon" : "glyphicon-exclamation-sign",
            "shortMsg" : "Stika!",
            "longMsg" : "Better check yourself, you're not looking too good"

        }
        


        $scope.showAlert = function(msg) {
            console.log("sono in showAlert");

            //$scope.alertMessage =msg;
            $scope.alertMessage.show = true;
            console.log($scope.alertMessage);
        };

        $scope.closeAlert = function() {
            console.log("Alert chiuso");
            $scope.alertMessage.show = false;     
        };


        
        $scope.isActive = function (viewLocation) { 
            return $location.path().includes(viewLocation);
        };

        $scope.applyNewSettings = function(){
            console.log($scope.sections);

            
            $scope.sections.Email.debugLevel = $scope.sections.General.LogLevel.id;
            configFactory.Config().update($scope.sections)
                 .$promise.then(
                    //success
                    function( value ){

                        var msg = {
                            "show" : true,
                            "type" : "success",
                            "glyphicon" : "glyphicon-ok",
                            "shortMsg" : "Configurazione aggiornata",
                            "longMsg" : "Configurazione aggiornata correttamente"

                        }
                        console.log("chiamo showalerrt");
                        $scope.showAlert(msg);

                        
                    },
                    //error
                    function( error ){
                        
                        console.log(error);
                     }
                  )

        }

        $scope.resetCampi = function(){
            $scope.sections = JSON.parse(JSON.stringify(save));
        }

        var config = configFactory.Config().query(
            function(response) {
            	
		        $scope.sections = response[0];
                

		        delete $scope.sections['_id'];
		        delete $scope.sections['Tag'];
		        delete $scope.sections['version'];
		        save = JSON.parse(JSON.stringify($scope.sections)); 

            },
            function(response){
                console.log('Errore')
            }
        );

    }])  	
    /*  Controller utilizzato per la generazione e la gestione della lista di una 
        "Collection" arbitraria
    */
    .controller('leftPaneControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

		    function htmlbodyHeightUpdate(){
				var height3 = $( window ).height()
				var height1 = $('.nav').height()+50
				var height2 = $('.main').height()
				if(height2 > height3){
					$('html').height(Math.max(height1,height3,height2)+10);
					$('body').height(Math.max(height1,height3,height2)+10);
				}
				else
				{
					$('html').height(Math.max(height1,height3,height2));
					$('body').height(Math.max(height1,height3,height2));
				}
				
			}
			$(document).ready(function () {
				htmlbodyHeightUpdate()
				$( window ).resize(function() {
					htmlbodyHeightUpdate()
				});
				$( window ).scroll(function() {
					var height2 = $('.main').height()
		  			htmlbodyHeightUpdate()
				});
			});


    }])

    .controller('generalSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('acquarioSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

        console.log($scope.sections['Acquario']);

    }])

    .controller('GPIOSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('irrigazioneSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])


    .controller('weatherInfoSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('emailSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams','$modal', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams,$modal) {




    }])


 ;