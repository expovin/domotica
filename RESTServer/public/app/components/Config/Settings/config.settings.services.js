'use strict';

angular.module('DomoHome')

.factory('configFactory',['$resource', 'CONFIG', function($resource,CONFIG) {	

	var conffac = {};

    conffac.Config = function(){
        return $resource(CONFIG.BASE_REST_URL+"/config", null, {'update' : {method : 'PUT'} });
    };    

    conffac.ConfigCid = function(){
        return $resource(CONFIG.BASE_REST_URL+"/config/:cid", null, {'update' : {method : 'PUT'} });
    };  

    conffac.Saved = function(){
        return $resource(CONFIG.BASE_REST_URL+"/config/saved", null, {'update' : {method : 'PUT', isArray:true} });
    }; 

    conffac.SavedCid = function(){
        return $resource(CONFIG.BASE_REST_URL+"/config/saved/:cid", null, {'update' : {method : 'PUT'} });
    };   

    return conffac;

}])     
   
;
