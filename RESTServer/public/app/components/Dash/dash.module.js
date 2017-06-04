'use strict';

angular.module('DomoHome.Dash', [
                            'DomoHome.Dash.home'
                            ,'ui.router'
                            ,'ngResource'
                            ,'ui.bootstrap'])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            /* SEZIONE SETTINGS*/

            .state('app.Dash.Home', {
                url: '/home',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/Home/IndexHome.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })      

            .state('app.Dash.Irrigazione', {
                url: '/irrigazione',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/Irrigazione/indexIrrigazione.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })


            .state('app.Dash.Energia', {
                url: '/energia',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/Energia/indexEnergia.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })

            .state('app.Dash.Allarme', {
                url: '/allarme',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/Allarme/indexAllarme.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })

            .state('app.Dash.Switch', {
                url: '/switch',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/Switch/indexSwitch.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })

            .state('app.Dash.WiFi', {
                url: '/wifi',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/WiFi/indexWiFi.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })

            .state('app.Dash.Settings', {
                url: '/settings',
                views: {
                    'iconWarningBar@app.Dash' : {
                        templateUrl : 'components/Dash/iconWarningBar.html',
                        controller : 'iconWarningBarControllers'
                    },
                    'DashMainPage@app.Dash': {
                        templateUrl : 'components/Dash/Settings/indexSettings.html',
                        controller : 'DashMainPageControllers'
                    },
                    'Navigation@app.Dash': {
                        templateUrl : 'components/Dash/Navigation.html',
                        controller : 'NavigationControllers'
                    }
                }
            })
    ;
});