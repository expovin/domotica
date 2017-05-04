'use strict';

angular.module('DomoHome')

        .factory('sensorFactory',['$resource', 'CONFIG', function($resource,CONFIG) {          

            var sensfac = {};

                sensfac.Sensori = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/sensori", null, {'update' : {method : 'PUT', isArray:true} });
                };    

                sensfac.Sensore1 = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/sensori/:ids', null, {'update' : {method : 'PUT'}, 'delete' : {method : 'DELETE'} });
                };

                sensfac.Letture = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/sensori/:ids/:Periodo', null, {'update' : {method : 'PUT', isArray:true} });
                };

                sensfac.LettureSort = function() {
                    return $resource(CONFIG.BASE_REST_URL+'/sensori/:ids/:Periodo/sort', null, {'update' : {method : 'PUT', isArray:true} });
                };

                return sensfac;

        }])

        .factory('controllerFactory',['$resource', 'CONFIG', function($resource,CONFIG) {    

            var ctrlFac = {};

            ctrlFac.getControllers = function(){
                return $resource(CONFIG.BASE_REST_URL+"/controllori", null, {'update' : {method : 'PUT', isArray:true} });
            };

            ctrlFac.getSelectedController = function(){
                return $resource(CONFIG.BASE_REST_URL+"/controllori/:contId", null, {'update' : {method : 'PUT', isArray:true} });
            };

            return ctrlFac;
        }])
   
;
