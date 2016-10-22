'use strict';

angular.module('DomoHome')
        .constant("port","3000")
        .constant("baseURL","http://192.168.0.102:3000/")


        .factory('attuatorFactory',['$resource', 'baseURL','port', function($resource,baseURL,port) {          

            var sensfac = {};
            var Sensori = {};
            var Sensore = {};

                sensfac.Attuatori = function(){
                    return $resource(baseURL+"attuatori", null, {'update' : {method : 'PUT', isArray:true} });
                }   

                sensfac.Attuatore = function() {
                    return $resource(baseURL+'attuatori/:ids', null, {'update' : {method : 'PUT'} });
                }

                sensfac.setStato = function() {
                    return $resource(baseURL+'attuatori/:ids/setStato', null, {'update' : {method : 'PUT'} });
                }

                sensfac.getStato = function() {
                    return $resource(baseURL+'attuatori/:ids/getStato', null, {'update' : {method : 'PUT'} });
                }

                sensfac.Dispositivi = function() {
                    return $resource(baseURL+'dispositivi/attuatore/:ids', null, {'update' : {method : 'PUT'} });
                }

                sensfac.Dispositivo = function() {
                    return $resource(baseURL+'dispositivi/:ids', null, {'update' : {method : 'PUT'} });
                }

                return sensfac;

        }])     
   
;
