'use strict';

angular.module('DomoHome')

        .factory('eventsCalendarFactory',['$resource', 'CONFIG', function($resource,CONFIG) {          

            var evCalfac = {};


                evCalfac.EventCalendar = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/EventiCalendario", null, {'update' : {method : 'PUT', isArray:true} });
                }   

                return evCalfac;

        }])     

        .factory('webAccountFactory',['$resource', 'CONFIG', function($resource,CONFIG) {          

            var evCalfac = {};


                evCalfac.getBuoniPastoAli = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/WebAccount/mensa?badge=40", null, {'update' : {method : 'PUT', isArray:true} });
                }   

                evCalfac.getBuoniPastoGian = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/WebAccount/mensa?badge=41", null, {'update' : {method : 'PUT', isArray:true} });
                }   

                return evCalfac;

        }]) 
   
;
