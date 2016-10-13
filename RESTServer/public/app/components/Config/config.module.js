'use strict';

angular.module('DomoHome.Config', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app.Config.Sensors', {
                url: '/sensors',
                views: {
                    'navMenuConfig@app.Config' : {
                        templateUrl : 'components/Config/navMenuConfig.html',
                        controller : 'navMenuConfigControllers'
                    },
                    'contentConfig@app.Config': {
                        templateUrl : 'components/Config/Sensors/indexConfigSensors.html'
                    },
                    'footerConfig@app.Config' : {
                        templateUrl : 'components/Config/footerConfig.html',
                        controller : 'footerConfigControllers'
                    }
                }
            })

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

            .state('app.Config.Sensors.List.Details.Letture', {
                url: '/letture:sensoreId',
                views: {
                    'SensorsReadings@app.Config.Sensors.List.Details': {
                        templateUrl : 'components/Config/Sensors/ReadingsSensors.html',
                        controller  : 'ReadingsSensorsController'
                    }
                }
            })

            .state('app.Config.Sensors.List.Details.ModifySensor', {
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
                        templateUrl : 'components/Config/AddRow.html',
                        controller  : 'AddNewSensorController'
                    }
                }
            })



    ;
});


