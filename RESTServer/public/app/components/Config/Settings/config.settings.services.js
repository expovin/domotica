'use strict';

angular.module('DomoHome')
        .constant("port","3000")
        .constant("baseURL","http://192.168.0.102:3000/")

.factory('configFactory',['$resource', 'baseURL','port', function($resource,baseURL,port) {	

	var conffac = {};

    conffac.Config = function(){
        return $resource(baseURL+"config", null, {'update' : {method : 'PUT', isArray:true} });
    };    

    return conffac;

}])     
   
;
