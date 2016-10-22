'use strict';

angular.module('DomoHome.Config', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            /* SEZIONE SETTINGS*/

            .state('app.Config.Settings', {
                url: '/settings',
                views: {
                    'navMenuConfig@app.Config' : {
                        templateUrl : 'components/Config/navMenuConfig.html',
                        controller : 'navMenuConfigControllers'
                    },
                    'contentConfig@app.Config': {
                        templateUrl : 'components/Config/Settings/indexConfigSettings.html',
                        controller : 'SettingsControllers'
                    }
                    /*,
                    'footerConfig@app.Config' : {
                        templateUrl : 'components/Config/footerConfig.html',
                        controller : 'footerConfigControllers'
                    }
                    */
                }
            })


            .state('app.Config.Settings.General', {
                url: '/general',
                views: {
                    'SettingsLeftPane@app.Config.Settings' : {
                        templateUrl : 'components/Config/Settings/leftPane.html',
                        controller : 'leftPaneControllers'
                    },
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/General.html',
                        controller : 'generalSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.General.Acquario', {
                url: '/Acquario',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/Acquario.html',
                        controller : 'acquarioSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.General.GPIO', {
                url: '/GPIO',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/GPIO.html',
                        controller : 'GPIOSettingsControllers'
                    }
                }
            })


            .state('app.Config.Settings.General.Irrigazione', {
                url: '/Irrigazione',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/Irrigazione.html',
                        controller : 'irrigazioneSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.General.WeatherInfo', {
                url: '/WeatherInfo',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/WeatherInfo.html',
                        controller : 'weatherInfoSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.General.Email', {
                url: '/Email',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/Email.html',
                        controller : 'emailSettingsControllers'
                    }
                }
            })

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

            .state('app.Config.Attuators.List.Details.Dispositivi', {
                url: '/dispositivi',
                views: {
                    'SensorsDetails@app.Config.Attuators.List': {
                        templateUrl : 'components/Config/Attuators/ModifyAttuator.html',
                        controller  : 'ModifyAttuatorController'
                    }
                }
            })


            .state('app.Config.Attuators.List.NewRow', {
                url: '/newRow',
                views: {
                    'SensorsDetails@app.Config.Attuators.List': {
                        templateUrl : 'components/Config/Attuators/AddAttuator.html',
                        controller  : 'AddNewAttuatorController'
                    }
                }
            })

            .state('app.Config.Attuators.List.Details.NewAppliances', {
                url: '/newAppl',
                views: {
                    'formAddAppliance@app.Config.Attuators.List.Details': {
                        templateUrl : 'components/Config/Attuators/AddAppliance.html',
                        controller  : 'AddNewApplianceController'
                    }
                }
            })


    ;
});


