'use strict';

angular.module('DomoHome.Config.sensors', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app.Config.Sensors.List', {
                url: '/list',
                views: {
                    'SensorsList@app.Config.Sensors' : {
                        templateUrl : 'components/Config/ListRows.html',
                        controller : 'ListaSensori'
                    }
                }
            })

            .state('app.Config.Sensors.List.Details', {
                url: '/details:rigaId',
                views: {
                    'SensorsDetails@app.Config.Sensors.List': {
                        templateUrl : 'components/Config/RowDetails.html',
                        controller  : 'DetailedSensorsController'
                    }
                }
            })

            .state('app.Config.Sensors.List.Details.Modify', {
                url: '/modSensor',
                views: {
                    'SensorsDetails@app.Config.Sensors.List': {
                        templateUrl : 'components/Config/Sensors/ModifySensor.html',
                        controller  : 'ModifySensorsController'
                    }
                }
            })

            .state('app.Config.Sensors.List.NewRow', {
                url: '/newRow',
                views: {
                    'SensorsDetails@app.Config.Sensors.List': {
                        templateUrl : 'components/Config/Sensors/AddSensor.html',
                        controller  : 'AddNewSensorController'
                    }
                }
            })


        ;
});