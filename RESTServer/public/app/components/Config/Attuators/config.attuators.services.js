'use strict';

angular.module('DomoHome')
        .constant("port","3000")
        .constant("baseURL","http://192.168.0.107:3000/")


        .factory('attuatorFactory',['$resource', 'baseURL','port', function($resource,baseURL,port) {          

            var sensfac = {};
            var Sensori = {};
            var Sensore = {};

                sensfac.Attuatori = function(){
                    return $resource(baseURL+"attuatori", null, {'update' : {method : 'PUT', isArray:true} });
                };    

                sensfac.Attuatore = function() {
                    return $resource(baseURL+'attuatori/:ids', null, {'update' : {method : 'PUT'} });
                }

                return sensfac;

        }])     
   
;
