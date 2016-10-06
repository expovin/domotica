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
                        templateUrl : 'components/Config/Sensors/ListRows.html',
                        controller : 'ListRowsController'
                    },
                    'SensorsDetails@app.Config.Sensors': {
                        templateUrl : 'components/Config/Sensors/DetailedRows.html',
                        controller  : 'DetailedRowsController'
                    },
                    'SensorsReadings@app.Config.Sensors' : {
                        templateUrl : 'components/Config/Sensors/ReadingsSensors.html',
                        controller : 'ReadingsSensorsController'
                    }
                }
            });
});


