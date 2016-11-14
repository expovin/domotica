'use strict';

angular.module('DomoHome')
        .constant("port","3000")
        .constant("baseURL","http://192.168.0.107:3000/")

/*
        .factory('sensorFactory',['$resource', 'baseURL','port', function($resource,baseURL,port) {          

            var sensfac = {};

                sensfac.Sensori = function(){
                    return $resource(baseURL+"sensori");
                };    

                sensfac.Sensore = function() {
                    return $resource(baseURL+'sensori/:ids');
                }

                sensfac.Letture = function() {
                    return $resource(baseURL+'sensori/:ids/:Periodo');
                }


                return sensfac;

        }])  
        */   

;
