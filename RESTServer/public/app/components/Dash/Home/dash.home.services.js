'use strict';

angular.module('DomoHome')

        .factory('eventsCalendarFactory',['$resource', 'CONFIG', function($resource,CONFIG) {          

            var evCalfac = {};


                evCalfac.EventCalendar = function(){
                    return $resource(CONFIG.BASE_REST_URL+"/EventiCalendario", null, {'update' : {method : 'PUT', isArray:true} });
                }   

                return evCalfac;

        }])     
   
;
