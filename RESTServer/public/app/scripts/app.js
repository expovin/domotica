'use strict';

angular.module('DomoHome', ['ui.router','ngResource','ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HomeController'
                    },
                    'content@': {
                        templateUrl : 'views/Home.html',
                        controller  : 'HomeController'
                    }
                    /*
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                    */
                }                
            })
        
        

            // route for the menu page
            .state('app.SensorConfig', {
                url: 'SensorConfig',
                views: {
                    'content@': {
                        templateUrl : 'views/SensorConfig.html',
                        controller  : 'SensorConfigController'
                    }
                }
            })

    
        $urlRouterProvider.otherwise('/');
    })
;
