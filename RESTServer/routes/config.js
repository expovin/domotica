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

});


router.route('/:cid')
/*
	DELETE
	Il Metodo delete viene utilizzato per ripristinare a "Current" una versione 
	precedentemente salvata come. Il "Current" attuale viene eliminato, il
	browser dovra' chiedere conferma prima di eseguire questa chiamata
*/
.delete(function(req, res, next){
	var Query = {"General.Tag":"Current"};
	var Update = { $set: { "General.Tag": "markForDelete" } };
	var Params = {upsert:true};

    MyConf.findOneAndUpdate(Query , Update , {Params} , function(err, conf){
    	if (err) {
    		res.json(RC(300,"DELETE /config - Primo update",err));
    	}
    	else {
			var Query = {"_id":req.params.cid};
			console.log(Query);
			var Update = { $set: { "General.Tag": "Current" } };
			var Params = {upsert:true};

		    MyConf.findOneAndUpdate(Query , Update , Params , function(err, conf){
		    	if (err) {
		    		res.json(RC(300,"DELETE /config - Secondo update",err));
		    	}
		    	else {
			    	MyConf.find({"General.Tag":"markForDelete"}).remove(function(err,deleted){
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

/* GET all configs but CURRENT */
router.route('/saved')
/*
	GET
	Il metodo get ritorna tutte le configurazioni salvate eccetto TAG : Current
*/
.get(function(req, res, next){

    MyConf.find({"General.Tag":{$ne : "Current"}}, function(err, conf){
    	if (err) 
    		{ res.json(RC(100,"GET /config",err)); }
    	else
    		res.json(conf);
    });
})

/*  Il metodo PUT permette di selezionare solo alcune colonne della
    collection da passare nel body con standard MongoDB
*/
.put(function(req, res, next){

    var query = MyConf.find({"General.Tag":{$ne : "Current"}}).select(req.body);
	    query.exec(function(err, config){
	      if (err) 
	        { res.json(RC(100,"PUT /config",err)); }
	      else
	        res.json(config);
	    });

});


/* GET all config parameters */
router.route('/saved/:cid')
/*
	GET
	Il metodo get ritorna il documento cnn ID=cid
*/
.get(function(req, res, next){

    MyConf.find({"_id":req.params.cid}, function(err, conf){
    	if (err) 
    		{ res.json(RC(100,"GET /config",err)); }
    	else
    		res.json(conf);
    });
})

/* PUT
   Il metodo put sostituisce l'intero documento con il nuovo presente
   nel corpo della richiesta. Viene chiamato a ogni conferma di modifica 
   configurazione.
*/
.put(function(req, res, next){   	
        // Put the reference in the user detail
	MyConf.findOneAndUpdate({"_id":req.params.cid}, req.body, {upsert:true}, 
		function(err, conf) {
    	if (err) 
    		{ res.json(RC(300,"PUT /config",err)); }
    	else
			res.json(RC(200,"PUT /config"));
	    
	 });
})

// Il metodo delete cancella la configurazione selezionata
.delete(function(req, res, next){
	var Query = {"_id":req.params.cid};
	MyConf.find(Query).remove(function(err,deleted){
		if (err) {
			res.json(RC(500,"DELETE /config/"+req.params.cid,err));
		}
		else
	    	res.json(RC(200,"DELETE /config/"+req.params.cid));
	});
});





module.exports = router;
