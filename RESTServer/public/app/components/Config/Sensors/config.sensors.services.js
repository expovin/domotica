'use strict';

angular.module('DomoHome')

        .factory('sensorFactory',['$resource', 'CONFIG', function($resource,CONFIG) {          

            var sensfac = {};
            var Sensori = {};
            var Sensore = {};

                sensfac.Sensori = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/sensori", null, {'update' : {method : 'PUT', isArray:true} });
                };    

                sensfac.Sensore = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/sensori/:ids', null, {'update' : {method : 'PUT'} });
                }

                sensfac.Letture = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/sensori/:ids/:Periodo', null, {'update' : {method : 'PUT', isArray:true} });
                }

                sensfac.LettureSort = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/sensori/:ids/:Periodo/sort', null, {'update' : {method : 'PUT', isArray:true} });
                }
                return sensfac;

        }])     
   
;
