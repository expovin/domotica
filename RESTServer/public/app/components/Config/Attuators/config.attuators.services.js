'use strict';

angular.module('DomoHome')

        .factory('attuatorFactory',['$resource', 'CONFIG', function($resource,CONFIG) {          

            var sensfac = {};
            var Sensori = {};
            var Sensore = {};

                sensfac.Attuatori = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/attuatori", null, {'update' : {method : 'PUT', isArray:true} });
                }   

                sensfac.Attuatore = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/attuatori/:ids', null, {'update' : {method : 'PUT'} });
                }

                sensfac.setStato = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/attuatori/:ids/setStato', null, {'update' : {method : 'PUT'} });
                }

                sensfac.getStato = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/attuatori/:ids/getStato', null, {'update' : {method : 'PUT'} });
                }

                sensfac.Dispositivi = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/dispositivi/attuatore/:ids', null, {'update' : {method : 'PUT'} });
                }

                sensfac.Dispositivo = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/dispositivi/:ids', null, {'update' : {method : 'PUT'} });
                }

                return sensfac;

        }])     
   
;
