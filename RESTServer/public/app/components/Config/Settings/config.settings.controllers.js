
'use strict';

angular.module('DomoHome') 

    /*  Controller utilizzato per la generazione e la gestione della lista di una 
        "Collection" arbitraria
    */
    .controller('ListaConfigurazioni', ['$scope','configFactory', 'ListRowsFactory',
        function($scope,configFactory,ListRowsFactory) {

        $scope.Titolo = "config";
        $scope.ripristina=0;

        /*  Di seguito sono elencati i soli campi della Collection che si vogliono elencare
            La chiave rappresenta l'etichetta del campo mentra il valore è il nome tecnico.
        */
         $scope.Fields = { 
                                '_id' : 2,
                                'General.Tag' : 1,
                                'General.Comment' : 1, 
                                'updatedAt':1
                                
                            };
        
        $scope.sensori = [];
        /* Recupero la lista di Sensori censita a sistema*/
        var configs =  configFactory.Saved().update($scope.Fields, function(){
            
            for(var key in configs){

                if(configs[key].General != undefined){
                        var config = {
                        '_id' : configs[key]['_id'],
                        'updatedAt' : configs[key]['updatedAt'],
                        'Tag' : configs[key]['General']['Tag'],
                        'Comment' : configs[key]['General']['Comment']
                    }
                    $scope.sensori.push(config);
                }
            }

         $scope.Fields = { 
                                '_id' : 2,
                                'Tag' : 1,
                                'Comment' : 1, 
                                'updatedAt':1
                                
                            };
    
            
        });



        /*  La funzione cambia stato permette di passare dallo stato consultazione allo stato
            cancellazione. Viene richimata la factory perchè condivisa con le altre funzioni
        */
        $scope.changeStatus = function(status) {
            if(status==2){
                $scope.ripristina=1;
                status=0;
            }

            ListRowsFactory.setStatus(status);
            if(status==1)
                $scope.ripristina=0;
        }
        

        $scope.selectRow = function() {
            ListRowsFactory.setSelectedRow(this.riga);
            ListRowsFactory.setStatus(2);
        }


        $scope.eliminaRiga = function() {
            $scope.result = configFactory.SavedCid().delete({cid:this.riga._id})
                 .$promise.then(
                    //success
                    function( value ){
                        var start = value['long Message'].indexOf("config/")+7;
                        var end = value['long Message'].indexOf("eseguita")-1;
                        var sensorId=value['long Message'].substring(start,end);
                        console.log(sensorId);

                        for (var s in $scope.sensori) {
                            if($scope.sensori[s]['_id'] == sensorId)
                                $scope.sensori.splice(s,1);          
                        }
                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }

        $scope.ripristinaConfig = function() {
            var row_id = this.riga._id;
            $scope.result = configFactory.ConfigCid().delete({cid:this.riga._id})
                 .$promise.then(
                    //success
                    function( value ){
                        /*
                        var start = value['long Message'].indexOf("config/")+7;
                        var end = value['long Message'].indexOf("eseguita")-1;
                        var sensorId=value['long Message'].substring(start,end);
                        */
                        console.log(value);
                        console.log(row_id);
                        var sensorId=row_id;

                        for (var s in $scope.sensori) {
                            if($scope.sensori[s]['_id'] == sensorId)
                                $scope.sensori.splice(s,1);          
                        }
                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }


    }])


    .controller('SettingsControllers', ['$scope','configFactory', '$location','generalHelperLibFactory',
        function($scope,configFactory,$location,generalHelperLibFactory) {


        var config = {};
        $scope.sections = {};
        var save = {};

        $scope.alertMessage = {};


        $scope.showAlert = function(msg) {
            $scope.alertMessage = msg;
        };

        $scope.closeAlert = function() {
            $scope.alertMessage.show = false;     
        };


        
        $scope.isActive = function (viewLocation) { 
            return $location.path().includes(viewLocation);
        };

        $scope.applyNewSettings = function(){

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

                                    // Aggiorno lo scope con il nuovo record aggiunto
                                    var config = {
                                        '_id' : $scope.sections['_id'],
                                        'updatedAt' : $scope.sections['updatedAt'],
                                        'Tag' : $scope.sections.General.Tag,
                                        'Comment' : $scope.sections.General.Comment
                                    }
                                    $scope.sensori.push(config);                                    


                                    
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


                    delete $scope.sections._id;
                    generalHelperLibFactory.DFSTraverse($scope.sections,
                                                        "$scope.sections",
                                                        "Obj", 
                    function(Leaf){
                        var arr = Leaf.split(".");
                        var key = arr[arr.length-1];

                        if(key == "_id")
                            eval("delete "+Leaf);
                        

                    }, 
                    function(){
                        InsertNewConfig();
                    });


                 }
                    

        }

        $scope.resetCampi = function(){
            $scope.sections = JSON.parse(JSON.stringify(save));
        }

        var config = configFactory.Config().query(
            function(response) {
            	
		        $scope.sections = response[0];
                

		        delete $scope.sections['_id'];
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