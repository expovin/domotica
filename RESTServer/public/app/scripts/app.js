'use strict';

angular.module('DomoHome', [
                                'DomoHome.Config'
                                ,'DomoHome.Dash'
                            ]
                )
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            
            .state('app', {
                url:'/',
                views: {
                    'content@': {
                        templateUrl : 'components/Home.html',
                        controller  : 'HomeController'
                    }
                }                
            })
        
 
             // La sezione Dashboard contiene l'interfaccia utente
            .state('app.Dash', {
                abstract : true,
                url : 'Dash',
                views : {
                    'content@' : {
                        templateUrl : 'components/Dash/IndexDash.html',
                        controller  : 'DashController'
                    }
                }
                
            })       


            // La sezione config contiene tutte le configurazioni
            .state('app.Config', {
                abstract : true,
                url : 'Config',
                views : {
                    'content@' : {
                        templateUrl : 'components/Config/IndexConfig.html',
                        controller  : 'SettingsController'
                    }
                }
                
            })

            ;

        $urlRouterProvider.otherwise('/');
    })
;