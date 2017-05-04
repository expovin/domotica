var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var request = require('request');
//var MyConf = require('../models/configModel');
var RC = require('../ReturnCodes');
var AllarmeUtil = require('../util/Allarme');
var router = express.Router();



var form = {
    userid: 'DOMOHOME',
    password: '91919'
};

var formData = querystring.stringify(form);
var contentLength = formData.length;

options = {
   hostname: '192.168.0.160',
   port: 443,
   path: '/login.htm?action=login&language=253',
   method: 'POST',
   headers: {
   	  'Content-Type': 'application/x-www-form-urlencoded',
   	  'Content-Length': Buffer.byteLength(formData)
   },
   body: formData,
};

router.route('/login')

.get(function(req, res, next){

	try{
		console.log(options);
		var outData={};

		request.post({
		  url: 'http://192.168.0.160:443/login.htm?action=login&language=253',
		  form: form
		}, function (err, httpResponse, body) { 
			if(err)
				console.log("Errore: "+err);

		    sessionId = AllarmeUtil.getSessionId(body, function(sessionId){
		    	outData['sessionId']=sessionId;


			    AllarmeUtil.getStatoAree(body, function(statoAree){
			    	outData['STATO AREE']=statoAree;
			    	res.json(outData);
			    });

		    });
		})


	} catch (err) {
		console.log(err);
	}
});

router.route('/logoff/:sessionId')
.get(function(req, res, next){

		request.get({
		    headers: {
		      'Referer': 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=system_summary&action=update'
		    },
		  url: 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&action=logoff',
		}, function (err, httpResponse, body) { 
			if(err)
				console.log("Errore: "+err);

			res.json({'Logoff':httpResponse});
		})
});


router.route('/Ingressi/:sessionId')
.get(function(req, res, next){

		request.get({
		    headers: {
		      'Referer': 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=controller_status'
		    },
		  url: 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=status_zones',
		  form: form
		}, function (err, httpResponse, body) { 
			if(err)
				console.log("Errore: "+err);

			//fs.writeFileSync("Ingressi.txt", body);
			AllarmeUtil.getIngressi(body, function(statoIngressi){
			    	res.json({'INGRESSI':statoIngressi});
			});
		})
})

.post(function(req, res, next){

		var reqBody = {
			  area_1_expanded : "0",
			  area_2_expanded : "0",
			  area_3_expanded : "0",
			  area_4_expanded : "0",
		};

		
		console.log(formData);
		console.log(req.body.SettingArea);
		var area=0;

		if(req.body.Stato == "ON")
			reqBody['fullset_area'+parseInt(req.body.Area)]="Inserimento+Totale";

		if(req.body.Stato == "OFF")
			reqBody['unset_area'+parseInt(req.body.Area)]="Disinserito";	



		console.log(reqBody);
		var formData = querystring.stringify(reqBody);
		
		request.post({
		    headers: {
		      'Referer': 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=controller_status',
		      'Content-Type' : 'content-type : application/x-www-form-urlencoded',
		      'Content-Length': Buffer.byteLength(formData)
		    },
		  	url: 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=system_summary&action=update',
		  	form: reqBody
		}, function (err, httpResponse, body) { 
			if(err)
				console.log("Errore: "+err);

			    AllarmeUtil.getStatoAree(body, function(statoAree){
			    	res.json({"HEADERS" : httpResponse, "STATO AREE":statoAree});
			    });
		})

})
;

router.route('/Alert/:sessionId')
.get(function(req, res, next){

		request.get({
		    headers: {
		      'Referer': 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=status_flexc'
		    },
		  url: 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page=status_sysalert',
		  form: form
		}, function (err, httpResponse, body) { 
			if(err)
				console.log("Errore: "+err);

			AllarmeUtil.getAlerts(body, function(statoIngressi){
			    	res.json({'ALERTS':statoIngressi});
			});
		})
});

router.route('/Log/:sessionId/:type')
.get(function(req, res, next){

		request.post({
		    headers: {
		      'Referer': 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page='+req.params.type,
		      'Content-Type': 'application/x-www-form-urlencoded'
		    },
		  url: 'http://192.168.0.160:443/secure.htm?session='+req.params.sessionId+'&page='+req.params.type+'&max=999999',
		  form: form
		}, function (err, httpResponse, body) { 
			if(err)
				console.log("Errore: "+err);

			//fs.writeFileSync("Log.txt", body);

			AllarmeUtil.getLogs(body, function(Logs){
			    	res.json({'Logs':Logs});
			});
		})
});


router.route('/test')

.get(function(req, res, next){
    console.log(AllarmeUtil);
    var data = fs.readFileSync('Log.txt');

    sessionId = AllarmeUtil.getLogs(data, function(ingressi){
    	res.json({'Ingressi':ingressi});
    });

})

module.exports = router;