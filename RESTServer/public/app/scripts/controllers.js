'use strict';
angular.module('DomoHome')

    .directive('bootstrapSwitch', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          $(element).bootstrapSwitch({
            onSwitchChange: function(event, state) {
              scope.$apply(function() {
                ngModelCtrl.$setViewValue(state);
              });
            }
          });
        }
      }
    })

    .controller('HomeController', ['$scope','$timeout', function($scope,$timeout) {

            $scope.clock = "loading clock..."; // initialise the time variable
            $scope.tickInterval = 1000 //ms

            var tick = function() {
                $scope.clock = Date.now() // get the current time
                $timeout(tick, $scope.tickInterval); // reset the timer
            }

            // Start the timer
            $timeout(tick, $scope.tickInterval);

    }])

    .controller('SensorConfigController', ['$scope','sensorFactory', function($scope,sensorFactory) {

        $scope.sensori =  sensorFactory.Sensori().query(
            function(response) {
                console.log('OK');
            },
            function(response){
                console.log('Errore')
            }
        )

        $scope.inserisciNuovoSensore = function() {
            console.log("Aggiunta nuovo sensore");

            $scope.result = sensorFactory.Sensori().save($scope.nuovoSensore.sensore)
                 .$promise.then(
                    //success
                    function( value ){
                      $scope.sensori= sensorFactory.Sensori().query();
                      $scope.pulisciCampi();
                      $('#inserimentoNuovoSensore').css("display","none");

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

        $scope.aggiungiNuovoSensore = function(){
            $('#dettaglioSelezionato').css("display","none");
            $('#inserimentoNuovoSensore').css("display","block");
        }

        $scope.recuperoUltimeLetture = function() {

            $('#dettaglioLettureSensore').css("display","block");

           $scope.letture =  sensorFactory.Letture().query({ids:this.sensore._id,Periodo:'201609'},
                function(response) {
                    console.log('Recuperate letture');
                    
                },
                function(response){
                    console.log('Errore')
                }
            );
        }

        $scope.selectSensor = function() {
            $scope.sensore = this.sensore;

  

            $('#dettaglioSelezionato').css("display","block");
            $('#inserimentoNuovoSensore').css("display","none");
            $('#dettaglioLettureSensore').css("display","none");

        }

        $scope.cancellaSensore = function() {

            $scope.result = sensorFactory.Sensore().delete({ids:this.sensore._id})
                 .$promise.then(
                    //success
                    function( value ){
                      $scope.sensori= sensorFactory.Sensori().query(function(){
                             $scope.fatto();
                             $('#dettaglioSelezionato').css("display","none");
                      });
                     
                    },
                    //error
                    function( error ){
                        console.log(error);
                     }
                  )
        }

        $scope.showCross = function(){
            console.log("Passo alla visualizzazione di cancellazione");
            $(".myTagCrossDelete").css("display","table-cell");
            $(".myTagButtonDelete").css("display","inline");
            $(".myTagButtonRegular").css("display","none");
        }

        $scope.fatto = function(){
            console.log("Ritorno alla visualizzazione Standard");
            $(".myTagCrossDelete").css("display","none");
            $(".myTagButtonDelete").css("display","none");
            $(".myTagButtonRegular").css("display","inline");
        }

    }])
;
