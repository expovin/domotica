
'use strict';

angular.module('DomoHome') 

    .controller('SettingsControllers', ['$scope','configFactory', '$location',
        function($scope,configFactory,$location) {


            function isObject ( obj ) {
               return obj && (typeof obj  === "object");
            }

            function isArray ( obj ) { 
              return isObject(obj) && (obj instanceof Array);
            }
            
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

            if($scope.sections.General.Tag == "Current") {
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
                 else {

                    /*  Attraverso in modo recursivo tutta la struttura del JSON per eliminare tutte le chiavi
                    */



                    var InsertNewConfig = function(){
                        configFactory.Config().save($scope.sections)
                             .$promise.then(
                                //success
                                function( value ){

                                    var msg = {
                                        "show" : true,
                                        "type" : "success",
                                        "glyphicon" : "glyphicon-ok",
                                        "shortMsg" : "OK",
                                        "longMsg" : "Configurazione salvata correttamente"

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
                                        "longMsg" : "Errore nel salvataggio della configurazione : "+error

                                    }
                                    $scope.showAlert(msg);

                                 }
                              )  
                    };


                    var numInnerCall = 1;

                    var eliminaKeys = function myself (subSection,path) {

                        for (var key in subSection) {

                            if(typeof(subSection[key]) == 'object') {
                                numInnerCall +=1;
                                if (isArray(subSection[key]))
                                    myself(subSection[key],path+"["+key+"]");
                                else
                                    myself(subSection[key],path+"."+key);
                            }
                            else{
                                if(key == '_id') {
                                    console.log("$scope.sections."+path+"."+key +" : "+subSection[key]);
                                    delete $scope.sections[path];
                                }
                            }

                        }
                        numInnerCall --;
                        console.log(numInnerCall);


                        if(numInnerCall == 0){
                            setTimeout(function(){ InsertNewConfig(); }, 2000);
                            
                        }
                    };

                    eliminaKeys($scope.sections,"");


                 }
                    

        }

        $scope.resetCampi = function(){
            $scope.sections = JSON.parse(JSON.stringify(save));
        }

        var config = configFactory.Config().query(
            function(response) {
            	
		        $scope.sections = response[0];
                

		        delete $scope.sections['_id'];
		    //    delete $scope.sections['Tag'];
		    //    delete $scope.sections['version'];
                delete $scope.sections['updatedAt'];
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