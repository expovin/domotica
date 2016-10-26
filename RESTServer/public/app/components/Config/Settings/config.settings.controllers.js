'use strict';

angular.module('DomoHome') 

    .controller('SettingsControllers', ['$scope','configFactory', '$location',
        function($scope,configFactory,$location) {

        var config = {};
        $scope.sections = {};
        var save = {};

        $scope.alertMessage = {};


        $scope.showAlert = function(msg) {

            $scope.alertMessage = msg;
            console.log($scope.alertMessage);
        };

        $scope.closeAlert = function() {
            $scope.alertMessage.show = false;     
        };


        
        $scope.isActive = function (viewLocation) { 
            return $location.path().includes(viewLocation);
        };

        $scope.applyNewSettings = function(){
            console.log($scope.sections);

            
            $scope.sections.Email.debugLevel = $scope.sections.General.LogLevel.id;

            if($scope.sections.Tag == "Current") {
                configFactory.Config().update($scope.sections)
                     .$promise.then(
                        //success
                        function( value ){

                            var msg = {
                                "show" : true,
                                "type" : "success",
                                "glyphicon" : "glyphicon-ok",
                                "shortMsg" : "OK",
                                "longMsg" : "Configurazione aggiornata correttamente."

                            }
                            $scope.showAlert(msg);

                            
                        },
                        //error
                        function( error ){
                            
                            var msg = {
                                "show" : true,
                                "type" : "danger",
                                "glyphicon" : "glyphicon-remove",
                                "shortMsg" : "Errore",
                                "longMsg" : "Errore nell'aggiornamento della configurazione : "+error

                            }
                            $scope.showAlert(msg);

                         }
                      )
                 }
                 else
                    console.log("Gestione salvataggio configurazione "+$scope.sections.Tag);

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

                        var msg = {
                            "show" : true,
                            "type" : "danger",
                            "glyphicon" : "glyphicon-remove",
                            "shortMsg" : "Errore",
                            "longMsg" : "Errore nel reperimento della configurazione: "+response

                        }
                        $scope.showAlert(msg);

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

    .controller('saveConfigSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

            console.log("Configurazione da salvare con nome "+$scope.configName);

    }])


    .controller('generalSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('acquarioSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('GPIOSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('irrigazioneSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

            console.log("Sono in irrigazioneSettingsControllers");
            $scope.numZona=0;
            $scope.buttonClass = "btn btn-primary";
            $scope.disabled = "btn btn-primary disabled"

            $scope.goUp = function() {
                $scope.numZona+=1;
            };

            $scope.goDown = function() {
                $scope.numZona-=1;
            };


    }])


    .controller('weatherInfoSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('emailSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams','$modal', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams,$modal) {




    }])


 ;