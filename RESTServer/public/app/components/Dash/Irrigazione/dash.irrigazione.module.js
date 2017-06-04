'use strict';

angular.module('DomoHome.Dash.Irrigazione', [
                             'ui.router'
                            ,'ngResource'
                            ,'ui.bootstrap'
                        ])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider



            .state('app.Dash.Irrigazione', {
                url: '/Irrigazione',
                views: {
                    'chartIrrigato@app.Dash.Irrigazione': {
                        templateUrl : 'components/Dash/Irrigazione/chartIrrigato.html',
                        controller : 'chartIrrigatoControllers'
                    },
                    'situazioneMeteo@app.Dash.Irrigazione': {
                        templateUrl : 'components/Dash/Irrigazione/situazioneMeteo.html',
                        controller : 'situazioneMeteoControllers'
                    },
                    'consoleActual@app.Dash.Irrigazione': {
                        templateUrl : 'components/Dash/Irrigazione/consoleActual.html',
                        controller : 'consoleActualControllers'
                    },
                    'switches@app.Dash.Irrigazione': {
                        templateUrl : 'components/Dash/Irrigazione/switches.html',
                        controller : 'switchesControllers'
                    }
                }
            })


        ;
});