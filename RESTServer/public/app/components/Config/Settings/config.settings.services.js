'use strict';

angular.module('DomoHome')
        .constant("port","3000")
        .constant("baseURL","http://192.168.0.102:3000/")

.factory('configFactory',['$resource', 'baseURL','port', function($resource,baseURL,port) {	

	var conffac = {};

    conffac.Config = function(){
        return $resource(baseURL+"config", null, {'update' : {method : 'PUT'} });
    };    

    conffac.ConfigCid = function(){
        return $resource(baseURL+"config/:cid", null, {'update' : {method : 'PUT'} });
    };  

    conffac.Saved = function(){
        return $resource(baseURL+"config/saved", null, {'update' : {method : 'PUT', isArray:true} });
    }; 

    conffac.SavedCid = function(){
        return $resource(baseURL+"config/saved/:cid", null, {'update' : {method : 'PUT'} });
    };   

    return conffac;

}])     
   
;
