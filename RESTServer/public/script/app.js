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
                }                
            })
        
        
            .state('cfg', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'nemuNavigazione': {
                        templateUrl : 'views/menuNavigazione.html',
                        controller  : 'MenuController'
                    },
                    'content@': {
                        templateUrl : 'views/Config.html',
                        controller  : 'HomeController'
                    }
                }                
            })


            // route for the menu page
            .state('cfg.SensorConfig', {
                url: 'SensorConfig',
                views: {
                    'content@': {
                        templateUrl : 'views/SensorConfig.html',
                        controller  : 'SensorConfigController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/error');
    })
;