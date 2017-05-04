var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var request = require('request');
//var MyConf = require('../models/configModel');
var RC = require('../ReturnCodes');
var WebAccountUtil = require('../util/WebAccount');
var router = express.Router();

var form1 = {
    vcmn: '154'
};

var form2 = {
    badge: '40',
    pwd1: 'pappagi',
    tessera:'',
    pwd2:'',
    terminalid:'',
    pos:'',
    com:'',
    buonipagina:''
};



var formData1 = querystring.stringify(form1);
var formData2 = querystring.stringify(form2);

router.route('/mensa')

.get(function(req, res, next){

var Options1 = {
		  url: 'https://95.240.148.63/utenza/grs800/login.asp',
		  method: 'POST',
		  headers: {
		   'Content-Type':'application/x-www-form-urlencoded',
		   'Content-Length': Buffer.byteLength(formData1),
		   'Upgrade-Insecure-Requests' : 1
		  },
		  form: form1,
		};

var Options2 = {
				url: 'https://95.240.148.63/utenza/grs800/checkLogin.asp',
				method: 'POST',
				headers: {
				   'Referer': 'https://95.240.148.63/utenza/grs800/login.asp',
		   		   'Content-Type':'application/x-www-form-urlencoded',
		   	 	   'Content-Length': Buffer.byteLength(formData2)
				 },
				  form: form2,
			}


	try{
		var outData={};
		console.log(Options1);



		request.post(Options1, function (err, httpResponse, body) { 

			if(err)
				console.log("Errore: "+err);
	

		    cookie=WebAccountUtil.getMensaCookie(httpResponse.headers['set-cookie'][0]);
		    Options2.headers['Cookie']=cookie;
		    Options2.form.badge = req.query.badge;

		    console.log(req.params);
		    console.log(httpResponse.statusCode);
		    console.log(httpResponse.headers);
		    console.log(httpResponse.request.headers);
		    console.log(cookie);
		    console.log(Options2);


		    /* INNER REQUEST using the Cookie got in the previous request*/

			request.post(Options2, function (Innerr, InnhttpResponse, Innbody) { 

				
				console.log(InnhttpResponse.statusCode);
		    	console.log(InnhttpResponse.headers);

		    	request.get({
		    		url: 'https://95.240.148.63/utenza/grs800/anagrafica.asp',
		    		method : 'GET',
		    		headers : {
		    			'Content-Type':'application/x-www-form-urlencoded',
		    			'Cookie' : cookie
		    		}
		    	}, function(Lsterr, LsthttpResponse, Lstbody){
		    		
						WebAccountUtil.getMensaData(Lstbody,function(Saldo){
							res.json(Saldo);
						})
		    	})
			})


		})


	} catch (err) {
		console.log(err);
	}
});

router.route('/test')

.get(function(req, res, next){
    var data = fs.readFileSync('Mensa.txt');
    jData = JSON.parse(data);

	WebAccountUtil.getMensaData(jData,function(Saldo){
		console.log(Saldo);
		res.json(Saldo);
	})
    

})



module.exports = router;