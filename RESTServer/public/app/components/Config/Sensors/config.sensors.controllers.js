'use strict';

angular.module('DomoHome')


    /*  Controller utilizzato per la generazione e la gestione della lista di una 
        "Collection" arbitraria
    */
    .controller('ListaSensori', ['$scope','sensorFactory','ListRowsFactory','$stateParams', 
        function($scope,sensorFactory,ListRowsFactory,$stateParams) {

        $scope.Titolo = "Sensori";

        console.log(sensorFactory);

        /*  Di seguito sono elencati i soli campi della Collection che si vogliono elencare
            La chiave rappresenta l'etichetta del campo mentra il valore è il nome tecnico.
        */
         $scope.Fields = { 
                            //    '_id' : 0,
                                'Modello' : 1, 
                                'Tipo':1, 
                                'Sito':1, 
                                'TracciaStoria' : 1, 
                                'ultimaLettura' :1,
                                'dataUltimoAggiornamento' : 1,
                                'dataInserimento' : 2,
                                'Image' : 2,
                                'Datasheet' : 2
                                
                            };
        
        console.log(sensorFactory.Sensori().update);
        /* Recupero la lista di Sensori censita a sistema*/
        $scope.sensori =  sensorFactory.Sensori().update($scope.Fields);

     //   $rootScope.sensori = $scope.sensori;


        /*  La funzione cambia stato permette di passare dallo stato consultazione allo stato
            cancellazione. Viene richimata la factory perchè condivisa con le altre funzioni
        */
        $scope.changeStatus = function(status) {
            ListRowsFactory.setStatus(status);
            $scope.ripristina=0;
        }
        

        $scope.selectRow = function() {
            ListRowsFactory.setSelectedRow(this.riga);
            ListRowsFactory.setStatus(2);
        }


        $scope.eliminaRiga = function() {

            console.log("Vado ad eliminare il sensore id: "+this.riga._id);
            console.log(sensorFactory.Sensore);

            
            $scope.result = sensorFactory.Sensore1().delete({ids:this.riga._id})
                 .$promise.then(
                    //success
                    function( value ){
                        var start = value['long Message'].indexOf("sensori/")+8;
                        var end = value['long Message'].indexOf("eseguita")-1;
                        var sensorId=value['long Message'].substring(start,end);

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

    .controller('DetailedSensorsController', ['$scope','$stateParams','sensorFactory', '$modal',
        function($scope,$stateParams,sensorFactory,$modal) {

        
        var sensoreId = $stateParams.rigaId;

        for(var s in $scope.sensori) {
            if($scope.sensori[s]['_id'] == sensoreId)
                $scope.sensore = $scope.sensori[s];
        }

        $scope.Fields = {
            'SX' : ["Modello", "Tipo", "Sito", "TracciaStoria", "ultimaLettura"],
            'DX' : ["dataUltimoAggiornamento", "dataInserimento"]
        }

        $scope.OpenModalLetture = function(idSensore) {
            console.log("idSensore : "+idSensore);

            $modal.open({
                templateUrl : 'components/Config/Sensors/ReadingsSensors.html',
                controller  : 'ReadingsSensorsController',
                resolve : {
                    param : function () {
                        return idSensore;
                    }
                }
            });
        }

    }])

    .controller('ModifySensorsController', ['$scope','$stateParams','sensorFactory', 
        function($scope,$stateParams,sensorFactory) {

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




    .controller('ReadingsSensorsController', ['$scope','$modalInstance','param','sensorFactory', 'chartLibFactory',
        function($scope,$modalInstance,param,sensorFactory,chartLibFactory) {

        var id = param;

        //console.log("Atterrato in ReadingsSensorsController con parametro "+id);

        var today = new Date();
        var mm =  today.getMonth()+1;
        mm = "00" + mm;
        mm = mm.substring(mm.length-2);
        var yyyy = today.getFullYear();
        var periodo = yyyy+mm;

        $scope.idSensore = id;
        $scope.Periodo = periodo;

        $scope.MostraValori = function(){
            $('.sensorsReadingValueStatus').css("display","block");
            $('.sensorsReadingChartStatus').css("display","none");
        }

        $scope.MostraGrafico = function(){
            $('.sensorsReadingValueStatus').css("display","none");
            $('.sensorsReadingChartStatus').css("display","block");
        }

        //console.log("Anno : "+yyyy+" Mese :"+mm)
        //console.log("Richiamo delle letture con parametro ",periodo);

        console.log(sensorFactory.Letture().query);

        sensorFactory.Letture().query({ids:id,Periodo:periodo},
            function(response) {
               var data=[];
               $scope.letture =  response;
               
               for(var ele in response){
                    var point=[];
                    if(response[ele].hasOwnProperty('Letture')){
                        var now = new Date(response[ele].Letture.DataPrimoInserimento);

                        var now_utc = Date.UTC( now.getFullYear(), 
                                                now.getMonth(), 
                                                now.getDate(),  
                                                now.getHours(), 
                                                now.getMinutes(), 
                                                now.getSeconds());

                        point.push(now_utc);
                        point.push(response[ele].Letture.lettura)

                        console.log(point);
                        data.push(point);
                    }
               }
               console.log(data);

               var cfg={
                    title: {
                        text: 'Temperature rilevate nel periodo '+$scope.Periodo
                    },
                    yAxis: {
                        title: {
                            text: 'Temparatura'
                        }
                    }
               };

               chartLibFactory.timeSeriesZoomable(data,cfg);      
            },
            function(response){
                console.log('Errore')
            }
        )

        $scope.cancel = function () {
            console.log("Cancel");
            //$modalInstance.dismiss('cancel');
            $modalInstance.close();
        }

    }])
    ;
