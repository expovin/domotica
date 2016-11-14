'use strict';

angular.module('DomoHome.Config.attuators', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

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