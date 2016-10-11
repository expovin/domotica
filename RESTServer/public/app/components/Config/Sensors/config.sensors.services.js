'use strict';

angular.module('DomoHome')
        .constant("port","3000")
        .constant("baseURL","http://192.168.0.107:3000/")


        .factory('sensorFactory',['$resource', 'baseURL','port', function($resource,baseURL,port) {          

            var sensfac = {};
            var Sensori = {};
            var Sensore = {};

                sensfac.Sensori = function(){
                    return $resource(baseURL+"sensori", null, {'update' : {method : 'PUT', isArray:true} });
                };    

                sensfac.setSensori = function(sensori) {
                    Sensori = sensori;
                }

                sensfac.getSensori = function() {
                    return(Sensori);
                }

                sensfac.Sensore = function() {
                    return $resource(baseURL+'sensori/:ids');
                }

                sensfac.Letture = function() {
                    return $resource(baseURL+'sensori/:ids/:Periodo');
                }


                return sensfac;

        }])     
   
;
