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
                                'Produttore' : 1,
                                'Datasheet' : 2, 
                                'Tipo':1, 
                                'Sito':1, 
                                'Descrizione':1,
                                'TracciaStoria' : 1, 
                                'dataInserimento' : 2,
                                'dataUltimaModifica' : 2,
                                'Image' :2
                                
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

    .controller('DetailedAttuatorsController', ['$scope','$stateParams','sensorFactory', '$modal',
        function($scope,$stateParams,sensorFactory,$modal) {

        console.log("DetailedAttuatorsController fired!");
        var attuatoreId = $stateParams.rigaId;

        for(var s in $scope.sensori) {
            if($scope.sensori[s]['_id'] == attuatoreId)
                $scope.sensore = $scope.sensori[s];
        }

        $scope.Fields = {
            'SX' : ["Produttore", "Tipo", "Sito", "TracciaStoria", "Descrizione","Connessione"],
            'DX' : ["dataInserimento","dataUltimaModifica"]
        }

        $scope.OpenModalAppliances = function(idAttuatore) {

            $modal.open({ 
            
                templateUrl : 'components/Config/Attuators/ModalDispositivi.html',
                controller  : 'ModalDispositiviController',
                resolve : {
                    param : function () {
                        return idAttuatore;
                    }
                }
            
            
            });
        }

        $scope.OpenModalAddAppliances = function(idAttuatore) {

            $modal.open({ 
            
                templateUrl : 'components/Config/Attuators/ModalAddAppliance.html',
                controller  : 'ModalAddNewApplianceController',
                resolve : {
                    param : function () {
                        return idAttuatore;
                    }
                }
            
            
            });
        }

    }])

    .controller('ModifyAttuatorController', ['$scope','$stateParams','attuatorFactory', 
        function($scope,$stateParams,attuatorFactory) {

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
             $scope.result = attuatorFactory.Attuatore().update({ids:id}, $scope.sensore)
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


    .controller('AddNewAttuatorController', ['$scope','$stateParams','attuatorFactory',
        function($scope,$stateParams,attuatorFactory) {



        $scope.inserisciNuovoSensore = function() { 

            $scope.result = attuatorFactory.Attuatori().save($scope.nuovoSensore.sensore)
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
            $scope.nuovoSensore.sensore={};
        }        

    }])


    .controller('ModalAddNewApplianceController', ['$scope','$modalInstance','param','attuatorFactory', 
        function($scope,$modalInstance,param,attuatorFactory) {

        var id = param;
        console.log("id : "+id);

        $scope.devices =  attuatorFactory.Dispositivi().query({ids:id},
            function(response) {
                console.log('Recuperate Devices');        
            },
            function(response){
                console.log('Errore')
            }
        );

        $scope.eliminaAppliance = function() {
            $scope.result = attuatorFactory.Dispositivo().delete({ids:this.device._id})
                 .$promise.then(
                    //success
                    function( value ){
                        var start = value['long Message'].indexOf("dispositivi/")+12;
                        var end = value['long Message'].indexOf("eseguita")-1;
                        var deviceId=value['long Message'].substring(start,end);
                        console.log(deviceId);

                        for (var s in $scope.devices) {
                            if($scope.devices[s]['_id'] == deviceId)
                                $scope.devices.splice(s,1);          
                        }
                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }


        $scope.AddAppliance = function(){
            $scope.newAppliance['AttuatoreId'] = id;
            $scope.newAppliance['Stato'] = false;
            $scope.result = attuatorFactory.Dispositivo().save($scope.newAppliance)
                 .$promise.then(
                    //success
                    function( value ){
                        var start = value['long Message'].indexOf("Inserito id")+12;
                        var end = value['long Message'].indexOf("eseguita")-1;
                        var deviceId=value['long Message'].substring(start,end);
                        console.log(deviceId);

                        $scope.newAppliance['_id']=deviceId;
                        $scope.devices.push($scope.newAppliance);
                        $scope.newAppliance = {};
                        
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }

        $scope.cancel = function () {
            console.log("Cancel");
            $modalInstance.dismiss('cancel');
        }

        $scope.pulisciCampi = function(){
            $scope.newAppliance = {};
        }   

    }])


    .controller('ModalDispositiviController', ['$scope','$modalInstance','param','attuatorFactory', 'usSpinnerService',
        function($scope,$modalInstance,param,attuatorFactory,usSpinnerService) {

        var id = param;
        console.log("id : "+id);


        $scope.devices =  attuatorFactory.Dispositivi().query({ids:id},
            function(response) {
                console.log('Recuperate Devices');        
            },
            function(response){
                console.log('Errore')
            }
        );

        $scope.cancel = function () {
            console.log("Cancel");
            $modalInstance.dismiss('cancel');
        }

        $scope.changeStatus = function(posizione) {

            var id=$scope.devices[posizione]['_id'];
            delete $scope.devices[posizione]['_id'];
            delete $scope.devices[posizione]['__v'];

            attuatorFactory.Dispositivo().update({ids:id},$scope.devices[posizione])
                 .$promise.then(
                    //success
                    function( value ){
                        console.log(value);
                        $scope.devices[posizione]['_id']=id;
                        if($scope.devices[posizione]['Stato'])
                            var stato="1"
                        else
                            var stato="0"

                        var body={'Appliance':id, 'stato':stato}

                        attuatorFactory.setStato().update({ids:id},body);
                        usSpinnerService.stop('spinner-1');


                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )

            usSpinnerService.spin('spinner-1');



        }

    }])


.controller('MyController', ['$scope', 'usSpinnerService', function($scope, usSpinnerService){
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }
    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }
}])


    ;