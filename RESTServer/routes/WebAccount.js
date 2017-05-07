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

var form3= {
	username: 'EXPOVIN',
	password : 'risparmia2016',
	'login-form-type' : 'pwd'
}

var formData1 = querystring.stringify(form1);
var formData2 = querystring.stringify(form2);
var formData3 = querystring.stringify(form3);

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


router.route('/edison')
.get(function(req, res, next){

	var uri=['https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_buttonBlock.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_loginTemplate.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_loginHeaderTemplate.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_login_mobile.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_publicHeader.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_comunicazione.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_CalendarTemplate.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_comunicazionePublicToggle.html',
	'https://www.edisonenergia.it/edison/widgets/widgets/templates/Edison_publicHeaderProfileMobile.html',
	'https://www.edisonenergia.it/apimanager-pa-s-mc/clienti/v1/recuperaDatiProfilo?request.preventCache=1494005957408',
	'https://crossdomain-ws.conversiondrive.it/crossd_iframe.html',
	'https://m1.vivocha.com/a/edisonenergia/api/dataframe/default/',
	'https://d8rathq6zmxbv.cloudfront.net/edison_energia/fe/assets/html/anti_exit_template.html',
	'https://d8rathq6zmxbv.cloudfront.net/edison_energia/fe/assets/html/right_slide_in_template.html'
	];

	var cookies=[];
	var setCookie='';
	var cont=0;

	getAllCookies(0);

	function getAllCookies(idx) {	

		request.get({
			url: uri[idx],
			method : 'GET',
			headers : {
				'Content-Type':'application/x-www-form-urlencoded',
				Cookie : setCookie
			}
		}, function(err, httpResponse, body){  

				cont+=1;

				if(err)
					console.log("Errore: "+err);

				//fs.writeFileSync('edison.txt',httpResponse.headers);
				
				//var setCookie = WebAccountUtil.coockyfy(cookies);
				if(httpResponse.headers['set-cookie'])
					cookies.push(WebAccountUtil.getMensaCookie(httpResponse.headers['set-cookie'][0])); 	

				setCookie = WebAccountUtil.coockyfy(cookies.filter( WebAccountUtil.onlyUnique ));
				if(uri.length > idx+1){
					getAllCookies(idx+1);
				}
				else{
					console.log("Usito dal ciclo");

					var PostOptions = {
							  url: 'https://www.edisonenergia.it/pkmslogin.form',
							  method: 'POST',
							  headers: {
							   'Content-Type':'application/x-www-form-urlencoded; charset=utf-8',
							   'Content-Length': Buffer.byteLength(formData3),
							   'Upgrade-Insecure-Requests' : 1,
							   Cookie: setCookie
							  },
							  form: form3,
							};


					request.post(PostOptions, function (postErr, postHttpResponse, postBody) { 

						console.log(postHttpResponse.headers['set-cookie']);
						if(postHttpResponse.headers['set-cookie'])
							cookies.push(WebAccountUtil.getMensaCookie(postHttpResponse.headers['set-cookie'][0])); 	

						console.log(JSON.stringify(postHttpResponse.headers['set-cookie']));
						setCookie = WebAccountUtil.coockyfy(postHttpResponse.headers['set-cookie'].filter( WebAccountUtil.onlyUnique ));

							request.get({
								url: 'https://www.edisonenergia.it/myportal/myedison/bollette-e-pagamenti',
								method : 'GET',
								headers : {
									'Content-Type':'application/x-www-form-urlencoded',
									Cookie : setCookie
								}
							}, function(BollErr, BollHttpResponse, BollBody){  

									fs.writeFileSync('edison.txt',BollBody);
									res.json(BollHttpResponse);

							})

						
					})
					
				}
		})

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