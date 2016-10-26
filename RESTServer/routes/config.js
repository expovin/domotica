var express = require('express');
var bodyParser = require('body-parser');
var MyConf = require('../models/configModel');
var RC = require('../ReturnCodes');
var router = express.Router();

var document ={};

/* GET all config parameters */
router.route('/')

/*
	GET
	Il metodo get ritorna l'unico documento che contiene TAG : Current
*/
.get(function(req, res, next){

    MyConf.find({"General.Tag":"Current"}, function(err, conf){
    	if (err) 
    		{ res.json(RC(100,"GET /config",err)); }
    	else
    		res.json(conf);
    });
})

/* PUT
   Il metodo put sostituisce l'intero documento current con il nuovo presente
   nel corpo della richiesta. Viene chiamato a ogni conferma di modifica 
   configurazione.
*/
.put(function(req, res, next){   	
        // Put the reference in the user detail
	MyConf.findOneAndUpdate({"General.Tag":"Current"}, req.body, {upsert:true}, 
		function(err, conf) {
    	if (err) 
    		{ res.json(RC(300,"PUT /config",err)); }
    	else
			res.json(RC(200,"PUT /config"));
	    
	 });
})

/*
	POST
	Il metodo post viene utilizzato per salvare un nuovo documento. Il campo
	Tag presente nel corpo del messaggio dovra' essere diverso da "Current".
	Questo metodo viene utilizzato per salvare stati di configurazione
*/
.post(function(req, res, next){

    MyConf.create(req.body, function(err, saveConf){
    	if (err) {
    		res.json(RC(400,"POST /config",err));
    	}
    	else
    	    res.json(RC(200,"POST /config"));
    });

})


/*
	DELETE
	Il Metodo delete viene utilizzato per ripristinare a "Current" una versione 
	precedentemente salvata come. Il "Current" attuale viene eliminato, il
	browser dovra' chiedere conferma prima di eseguire questa chiamata
*/
.delete(function(req, res, next){
	var Query = {"Tag":"Current"};
	var Update = { $set: { "Tag": "markForDelete" } };
	var Params = {upsert:true};

    MyConf.findOneAndUpdate(Query , Update , Params , function(err, conf){
    	if (err) {
    		res.json(RC(300,"DELETE /config - Primo update",err));
    	}
    	else {
			var Query = {"Tag":req.body.Tag};
			console.log(Query);
			var Update = { $set: { "Tag": "Current" } };
			var Params = {upsert:true};

		    MyConf.findOneAndUpdate(Query , Update , Params , function(err, conf){
		    	if (err) {
		    		res.json(RC(300,"DELETE /config - Secondo update",err));
		    	}
		    	else {
			    	MyConf.find({"Tag":"markForDelete"}).remove(function(err,deleted){
				    	if (err) {
				    		res.json(RC(500,"DELETE /config",err));
				    	}
				    	else
				    		res.json(deleted);
			    	});
		    	}
		    });
    	}
	 });
});

module.exports = router;
