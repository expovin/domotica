var express = require('express');
var bodyParser = require('body-parser');
var Sensors = require('../models/SensoriModel');
var LettureSensori = require('../models/LettureSensoriModel');
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

    Sensors.find({}, function(err, sensors){
    	if (err) 
    		{ res.json(RC(100,"GET /sensori",err)); }
    	else
    		res.json(sensors);
    });
})

/*
	POST
	Il metodo post viene utilizzato per inserire a sistema un nuovo sensore.
	Ritorna l'id del sensore inserito. Questo id dovra' essere utilizzato per
	la registrazione di tutte le letture
*/
.post(function(req, res, next){
    Sensors.create(req.body, function(err, sensors){
    	if (err) {
    		res.json(RC(300,"POST /sensori",err));
    	}
    	else
    	    res.json(RC(200,"POST /sensori. Inserito id "+sensors._id));
    });
});

/*
	GET
	L'end point con /:uid opera su un sensore specifico
*/
router.route('/:uid')
// Recuper delle informazioni di un sensore specifico
.get(function(req, res, next){
    Sensors.find({"_id":req.params.uid}, function(err, sensors){
    	if (err) 
    		{ res.json(RC(100,"GET /sensori/"+req.params.uid,err)); }
    	else
       		res.json(sensors[0]);
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
    		{ res.json(RC(300,"PUT /sensori/"+req.params.uid,err)); }
    	else
			res.json(RC(200,"POST /sensori/"+req.params.uid));
	    
	 });
})

// Il metodo delete cancella un sensore dal sistema
.delete(function(req, res, next){
	var Query = {"_id":req.params.uid};
	Sensors.find(Query).remove(function(err,deleted){
		if (err) {
			res.json(RC(500,"DELETE /sensori/"+req.params.uid,err));
		}
		else
	    	res.json(RC(200,"DELETE /sensori/"+req.params.uid));
	});
});

router.route('/:sid/:periodo')
.get(function(req, res, next){
    console.log('Periodo : '+req.params.periodo+' idSensore : '+req.params.sid);
    LettureSensori.aggregate([
          {$match : {'Periodo' : req.params.periodo}},
          {$unwind : "$Letture"},
          {$match : {'Letture.idSensore':req.params.sid }},
          {$sort : {'Letture.DataUltimoAggiornamento' : -1}}

        ]
        , function(err, sensors){
        if (err) 
            { res.json(RC(100,"GET /sensori/"+req.params.uid,err)); }
        else
            res.json(sensors);
    });
});

router.route('/:sid/:periodo/:minDate')
.get(function(req, res, next){
    
    LettureSensori.aggregate([
          {$match : {'Periodo' : req.params.periodo, 'Letture.DataPrimoInserimento' : { $gt : req.params.periodo } }  },
          {$unwind : "$Letture"},
          {$match : {'Letture.idSensore':req.params.sid }},
          {$sort : {'Letture.DataUltimoAggiornamento' : -1}}

        ]
        , function(err, sensors){
        if (err) 
            { res.json(RC(100,"GET /sensori/"+req.params.uid,err)); }
        else
            res.json(sensors);
    });
})

module.exports = router;
