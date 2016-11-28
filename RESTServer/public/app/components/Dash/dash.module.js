'use strict';

angular.module('DomoHome.Dash', [
                            'ui.router',
                            'ngResource',
                            'ui.bootstrap'])

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

    ;
});