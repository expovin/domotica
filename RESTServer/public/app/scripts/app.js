'use strict';

angular.module('DomoHome', ['DomoHome.Config'])
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
        
        

            // route for the menu page

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