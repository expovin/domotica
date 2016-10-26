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


            .state('app.Config.Settings.CFG', {
                url: '/general',
                views: {
                    'SettingsLeftPane@app.Config.Settings' : {
                        templateUrl : 'components/Config/Settings/leftPane.html',
                        controller : 'leftPaneControllers'
                    }
                    /*,
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/General.html',
                        controller : 'generalSettingsControllers'
                    }
                    */
                }
            })

            .state('app.Config.Settings.CFG.General', {
                url: '/General',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/General.html',
                        controller : 'generalSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.saveConfig', {
                url: '/saveConfig',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/saveConfigAs.html',
                        controller : 'saveConfigSettingsControllers'
                    }
                }
            })


            .state('app.Config.Settings.CFG.Acquario', {
                url: '/Acquario',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/Acquario.html',
                        controller : 'acquarioSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.GPIO', {
                url: '/GPIO',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/GPIO.html',
                        controller : 'GPIOSettingsControllers'
                    }
                }
            })


            .state('app.Config.Settings.CFG.Irrigazione', {
                url: '/Irrigazione',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/Irrigazione.html',
                        controller : 'irrigazioneSettingsControllers'
                    },

                    'TabContent@app.Config.Settings.CFG.Irrigazione': {
                        templateUrl : 'components/Config/Settings/IrrigazioneGen.html',
                        controller : 'irrigazioneSettingsControllers'
                    }

                }
            })

            .state('app.Config.Settings.CFG.Irrigazione.Gen', {
                url: '/gen',
                views: {
                    'TabContent@app.Config.Settings.CFG.Irrigazione': {
                        templateUrl : 'components/Config/Settings/IrrigazioneGen.html',
                        controller : 'irrigazioneSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.Irrigazione.Relay', {
                url: '/relay',
                views: {
                    'TabContent@app.Config.Settings.CFG.Irrigazione': {
                        templateUrl : 'components/Config/Settings/IrrigazioneRelay.html',
                        controller : 'irrigazioneSettingsControllers'
                    }
                }
            })


            .state('app.Config.Settings.CFG.Irrigazione.Policy', {
                url: '/policy',
                views: {
                    'TabContent@app.Config.Settings.CFG.Irrigazione': {
                        templateUrl : 'components/Config/Settings/IrrigazionePolicy.html',
                        controller : 'irrigazioneSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.Irrigazione.Zone', {
                url: '/zone',
                views: {
                    'TabContent@app.Config.Settings.CFG.Irrigazione': {
                        templateUrl : 'components/Config/Settings/IrrigazioneZone.html',
                        controller : 'irrigazioneSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.Irrigazione.Zone.zone01', {
                url: '/zone01',
                views: {
                    'PillContent@app.Config.Settings.CFG.Irrigazione.Zone': {
                        templateUrl : 'components/Config/Settings/IrrigazioneZone01.html',
                        controller : 'irrigazioneSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.WeatherInfo', {
                url: '/WeatherInfo',
                views: {
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/WeatherInfo.html',
                        controller : 'weatherInfoSettingsControllers'
                    }
                }
            })

            .state('app.Config.Settings.CFG.Email', {
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


