'use strict';

angular.module('DomoHome.Dash.irrigazione', [
                             'ui.router'
                            ,'ngResource'
                            ,'ui.bootstrap'
                        ])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider



            .state('app.Dash.IrrigazioneMenu.Irrigazione', {
                url: '/Irrigazione',
                views: {
                    'chartIrrigatoWrapperPage@app.Dash.IrrigazioneMenu': {
                        templateUrl : 'components/Dash/Irrigazione/chartIrrigato.html',
                        controller : 'chartIrrigatoControllers'
                    },
                    'situazioneMeteoWrapperPage@app.Dash.IrrigazioneMenu': {
                        templateUrl : 'components/Dash/Irrigazione/situazioneMeteo.html',
                        controller : 'situazioneMeteoControllers'
                    },
                    'consoleActualWrapperPage@app.Dash.IrrigazioneMenu': {
                        templateUrl : 'components/Dash/Irrigazione/consoleActual.html',
                        controller : 'consoleActualControllers'
                    },
                    'switchesWrapperPage@app.Dash.IrrigazioneMenu': {
                        templateUrl : 'components/Dash/Irrigazione/switches.html',
                        controller : 'switchesControllers'
                    }
                }
            })


        ;
});