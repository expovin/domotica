'use strict';

angular.module('DomoHome')


    /*  Controller utilizzato per la generazione e la gestione della lista di una 
        "Collection" arbitraria
    */
    .controller('ListaAttuatori', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

        console.log("ListaAttuatoriController fired!");
        $scope.Titolo = "Attuatori";

        /*  Di seguito sono elencati i soli campi della Collection che si vogliono elencare
            La chiave rappresenta l'etichetta del campo mentra il valore è il nome tecnico.
        */
         $scope.Fields = { 
                            //    '_id' : 0,
                                'Modello' : 1, 
                                'Tipo':1, 
                                'Sito':1, 
                                'Descrizione':1,
                                'Traccia' : 1, 
                                'dataInserimento' : 2,
                                
                            };
        

        /* Recupero la lista di Sensori censita a sistema*/
        $scope.sensori =  attuatorFactory.Attuatori().update($scope.Fields);


        /*  La funzione cambia stato permette di passare dallo stato consultazione allo stato
            cancellazione. Viene richimata la factory perchè condivisa con le altre funzioni
        */
        $scope.changeStatus = function(status) {
            ListRowsFactory.setStatus(status);
        }
        

        $scope.selectRow = function() {
            ListRowsFactory.setSelectedRow(this.riga);
            ListRowsFactory.setStatus(2);
        }


        $scope.eliminaRiga = function() {

            $scope.result = attuatorFactory.Attuatore().delete({ids:this.riga._id})
                 .$promise.then(
                    //success
                    function( value ){
                        var start = value['long Message'].indexOf("attuatori/")+10;
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

    }])

    .controller('DetailedAttuatorsController', ['$scope','$stateParams','sensorFactory', 
        function($scope,$stateParams,sensorFactory) {

        console.log("DetailedAttuatorsController fired!");
        var attuatoreId = $stateParams.rigaId;

        for(var s in $scope.sensori) {
            if($scope.sensori[s]['_id'] == attuatoreId)
                $scope.sensore = $scope.sensori[s];
        }

        $scope.Fields = {
            'SX' : ["Modello", "Tipo", "Sito", "Traccia", "Descrizione","idGruppo","Porta","GPIO"],
            'DX' : ["dataInserimento"]
        }

    }])

    .controller('ModifyAttuatorController', ['$scope','$stateParams','sensorFactory', 
        function($scope,$stateParams,sensorFactory) {

        console.log("ModifyAttuatorController fired");
        var save={};
        var pos;

        var queryString = window.location.href;
        var start = queryString.indexOf("/details")+8;
        var end = queryString.length;
        var sensoreId=queryString.substring(start,end);

        for(var s in $scope.sensori) {
            if($scope.sensori[s]['_id'] == sensoreId){
                $scope.sensore = JSON.parse(JSON.stringify($scope.sensori[s]));
                save=JSON.parse(JSON.stringify($scope.sensore));
                pos=s;
            }
        }

        $scope.resetCampi = function(){
            console.log("resetCampi");
            $scope.sensore = JSON.parse(JSON.stringify(save));
        }

        $scope.applyModSensore = function() {

             var id=$scope.sensore['_id'];
             delete $scope.sensore['_id'];
             $scope.result = sensorFactory.Sensore().update({ids:id}, $scope.sensore)
                 .$promise.then(
                    //success
                    function( value ){
                        console.log(value);
                        $scope.sensore['_id']=id;
                        $scope.sensori[pos] = $scope.sensore;
                        
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }






    }])


    .controller('AddNewSensorController', ['$scope','$stateParams','sensorFactory', 
        function($scope,$stateParams,sensorFactory) {

        $scope.inserisciNuovoSensore = function() {

            

            $scope.result = sensorFactory.Sensori().save($scope.nuovoSensore.sensore)
                 .$promise.then(
                    //success
                    function( value ){
                        console.log(value);

                        var start = value['long Message'].indexOf("Inserito id")+12;
                        var end = value['long Message'].indexOf("eseguita")-1;
                        var sensorId=value['long Message'].substring(start,end);
                        $scope.nuovoSensore.sensore['_id']=sensorId;
                        
                        $scope.sensori.push($scope.nuovoSensore.sensore);
                        $scope.nuovoSensore.sensore={};
                        
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }


        $scope.pulisciCampi = function(){
            $scope.nuovoSensore.sensore.Modello='';
            $scope.nuovoSensore.sensore.Sito='';
            $scope.nuovoSensore.sensore.Tipo='';
            $scope.nuovoSensore.sensore.TracciaStoria=false;
            $scope.nuovoSensore.sensore.DeltaVariazioneTraccia='';
        }        
    }])


    .controller('ReadingsSensorsController', ['$scope','$stateParams','sensorFactory', function($scope,$stateParams,sensorFactory) {

        var id = $stateParams.sensoreId;

        var today = new Date();
        var mm = today.getMonth()+1
        var pad= "00"
        var mm = pad.substring(0,pad.length - mm.length) + mm;
        var yyyy = today.getFullYear();
        var periodo = yyyy+mm;
     


        $scope.letture =  sensorFactory.Letture().query({ids:id,Periodo:periodo},
            function(response) {
                console.log('Recuperate letture');        
            },
            function(response){
                console.log('Errore')
            }
        );

    }])
    ;