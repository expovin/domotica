'use strict';

angular.module('DomoHome.Config.settings', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider



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
                    /*
                    'SettingsMainCanvas@app.Config.Settings': {
                        templateUrl : 'components/Config/Settings/saveConfigAs.html',
                        controller : 'saveConfigSettingsControllers'
                    },
                    */
                    'SettingsListSavedConfig@app.Config.Settings' : {
                        templateUrl : 'components/Config/ListRows.html',
                        controller : 'ListaConfigurazioni'
                    }
                }
            })

            .state('app.Config.Settings.CFG.saveConfig.addNew', {
                url: '/addNew',
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

        ;
});