'use strict';

angular.module('DomoHome.Config', [
                            'DomoHome.Config.settings',
                            'DomoHome.Config.sensors',
                            'DomoHome.Config.attuators',
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
                }
            })


            .state('app.Config.Settings.CFG', {
                url: '/general',
                views: {
                    'SettingsLeftPane@app.Config.Settings' : {
                        templateUrl : 'components/Config/Settings/leftPane.html',
                        controller : 'leftPaneControllers'
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


    ;
});


