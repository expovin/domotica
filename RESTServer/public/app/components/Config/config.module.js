'use strict';

angular.module('DomoHome.Config', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            /*  SEZIONE SENSORI */

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


        /*  SEZIONE ATTUATORI */

            .state('app.Config.Attuators', {
                url: '/attuators',
                views: {
                    'navMenuConfig@app.Config' : {
                        templateUrl : 'components/Config/navMenuConfig.html',
                        controller : 'navMenuConfigControllers'
                    },
                    'contentConfig@app.Config': {
                        templateUrl : 'components/Config/Attuators/indexConfigAttuators.html'
                    },
                    'footerConfig@app.Config' : {
                        templateUrl : 'components/Config/footerConfig.html',
                        controller : 'footerConfigControllers'
                    }
                }
            })

            .state('app.Config.Attuators.List', {
                url: '/list',
                views: {
                    'AttuatorsList@app.Config.Attuators' : {
                        templateUrl : 'components/Config/ListRows.html',
                        controller : 'ListaAttuatori'
                    }
                }
            })

            .state('app.Config.Attuators.List.Details', {
                url: '/details:rigaId',
                views: {
                    'SensorsDetails@app.Config.Attuators.List': {
                        templateUrl : 'components/Config/RowDetails.html',
                        controller  : 'DetailedAttuatorsController'
                    }
                }
            })

            .state('app.Config.Attuators.List.Details.Modify', {
                url: '/modAttuator',
                views: {
                    'SensorsDetails@app.Config.Attuators.List': {
                        templateUrl : 'components/Config/Attuators/ModifyAttuator.html',
                        controller  : 'ModifyAttuatorController'
                    }
                }
            })

    ;
});


