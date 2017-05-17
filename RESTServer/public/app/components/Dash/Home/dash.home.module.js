'use strict';

angular.module('DomoHome.Dash.home', [
                             'ui.router'
                            ,'ngResource'
                            ,'ui.bootstrap'
                            ,'ds.clock'
							,'ngAnimate'
                        ])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider



            .state('app.Dash.Home.Datario', {
                url: '/Datario',
                views: {
                    'datarioOrologioWrapperPage@app.Dash.Home': {
                        templateUrl : 'components/Dash/Home/Datario.html',
                        controller : 'datarioControllers'
                    },
                    'meteoWrapperPage@app.Dash.Home': {
                        templateUrl : 'components/Dash/Home/Meteo.html',
                        controller : 'meteoControllers'
                    },
                    'temperaturaP0WrapperPage@app.Dash.Home': {
                        templateUrl : 'components/Dash/Home/TemperaturaP0.html',
                        controller : 'temperaturaControllers'
                    },
                    'googleCalendarWrapperPage@app.Dash.Home': {
                        templateUrl : 'components/Dash/Home/googleCalendar.html',
                        controller : 'googleCalendarControllers'
                    },
                    'temperaturaAcquarioWrapperPage@app.Dash.Home': {
                        templateUrl : 'components/Dash/Home/temperaturaAcquario.html',
                        controller : 'temperaturaAcquarioControllers'
                    },
                    'buoniMensaBimbiPage@app.Dash.Home': {
                        templateUrl : 'components/Dash/Home/buoniMensaBimbi.html',
                        controller : 'MensaBimbiControllers'
                    },
                }
            })


        ;
});