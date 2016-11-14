var express = require('express');
var bodyParser = require('body-parser');
var Sensors = require('../models/GPIOTemplateModel');
var RC = require('../ReturnCodes');
var router = express.Router();

var document ={};

/* GET all Sensors */
router.route('/')
/*
	GET
	Il metodo get ritorna l'elenco di tutti i sensori del sistema
*/
.get(function(req, res, next){

    Sensors.find({}, function(err, GPIOTemplate){
    	if (err) 
    		{ res.json(RC(100,"GET /GPIOTemplate",err)); }
    	else
    		res.json(GPIOTemplate);
    });
})

/*  Il metodo PUT permette di selezionare solo alcune colonne della
    collection da passare nel body con standard MongoDB
*/
.put(function(req, res, next){
    var query = Sensors.find({}).select(req.body);
    query.exec(function(err, GPIOTemplate){
      if (err) 
        { res.json(RC(100,"PUT /GPIOTemplate",err)); }
      else
        res.json(GPIOTemplate);
    });
})

/*
	POST
	Il metodo post viene utilizzato per inserire a sistema un nuovo sensore.
	Ritorna l'id del sensore inserito. Questo id dovra' essere utilizzato per
	la registrazione di tutte le letture
*/
.post(function(req, res, next){
    Sensors.create(req.body, function(err, GPIOTemplate){
    	if (err) {
    		res.json(RC(300,"POST /GPIOTemplate",err));
    	}
    	else
    	    res.json(RC(200,"POST /GPIOTemplate. Inserito id "+GPIOTemplate._id));
    });
});

/*
	GET
	L'end point con /:uid opera su un sensore specifico
*/
router.route('/:uid')
// Recuper delle informazioni di un sensore specifico
.get(function(req, res, next){
    Sensors.find({"_id":req.params.uid}, function(err, GPIOTemplate){
    	if (err) 
    		{ res.json(RC(100,"GET /GPIOTemplate/"+req.params.uid,err)); }
    	else
       		res.json(GPIOTemplate[0]);
    });
})
/* PUT
   Il metodo put modifica i dettagli di un sensore specifico
*/
.put(function(req, res, next){   	
        // Put the reference in the user detail
	Sensors.findOneAndUpdate({"_id":req.params.uid}, req.body, {upsert:true}, 
		function(err, conf){
    	if (err) 
    		{ res.json(RC(300,"PUT /GPIOTemplate/"+req.params.uid,err)); }
    	else
			res.json(RC(200,"POST /GPIOTemplate/"+req.params.uid));
	    
	 });
})

// Il metodo delete cancella un sensore dal sistema
.delete(function(req, res, next){
	var Query = {"_id":req.params.uid};
	Sensors.find(Query).remove(function(err,deleted){
		if (err) {
			res.json(RC(500,"DELETE /GPIOTemplate/"+req.params.uid,err));
		}
		else
	    	res.json(RC(200,"DELETE /GPIOTemplate/"+req.params.uid));
	});
});

module.exports = router;
