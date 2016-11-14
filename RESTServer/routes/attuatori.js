var express = require('express');
var bodyParser = require('body-parser');
var Attuatori = require('../models/AttuatoriModel');
var sys = require('sys')
var exec = require('child_process').exec;

//var LettureSensori = require('../models/LettureSensoriModel');
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

    Attuatori.find({}, function(err, attuatore){
    	if (err) 
    		{ res.json(RC(100,"GET /attuatori",err)); }
    	else
    		res.json(attuatore);
    });
})

/*  Il metodo PUT permette di selezionare solo alcune colonne della
    collection da passare nel body con standard MongoDB
*/
.put(function(req, res, next){
    var query = Attuatori.find({}).select(req.body);
    query.exec(function(err, attuators){
      if (err) 
        { res.json(RC(100,"PUT /attuatori",err)); }
      else
        res.json(attuators);
    });
})


/*
	POST
	Il metodo post viene utilizzato per inserire a sistema un nuovo sensore.
	Ritorna l'id del sensore inserito. Questo id dovra' essere utilizzato per
	la registrazione di tutte le letture
*/
.post(function(req, res, next){
    Attuatori.create(req.body, function(err, attuatore){
    	if (err) {
    		res.json(RC(300,"POST /attuatori",err));
    	}
    	else
    	    res.json(RC(200,"POST /attuatori. Inserito id "+attuatore._id));
    });
});

/*
	GET
	L'end point con /:uid opera su un sensore specifico
*/
router.route('/:uid')
// Recuper delle informazioni di un sensore specifico
.get(function(req, res, next){
    Attuatori.find({"_id":req.params.uid}, function(err, attuatori){
    	if (err) 
    		{ res.json(RC(100,"GET /attuatori/"+req.params.uid,err)); }
    	else
       		res.json(attuatori[0]);
    });
})
/* PUT
   Il metodo put modifica i dettagli di un sensore specifico
*/
.put(function(req, res, next){   	
        // Put the reference in the user detail
	Attuatori.findOneAndUpdate({"_id":req.params.uid}, req.body, {upsert:true}, 
		function(err, conf){
    	if (err) 
    		{ res.json(RC(300,"PUT /attuatori/"+req.params.uid,err)); }
    	else
			res.json(RC(200,"POST /attuatori/"+req.params.uid));
	    
	 });
})

// Il metodo delete cancella un sensore dal sistema
.delete(function(req, res, next){
	var Query = {"_id":req.params.uid};
	Attuatori.find(Query).remove(function(err,deleted){
		if (err) {
			res.json(RC(500,"DELETE /attuatori/"+req.params.uid,err));
		}
		else
	    	res.json(RC(200,"DELETE /attuatori/"+req.params.uid));
	});
});


router.route('/:aid/setStato')
.put(function(req, res, next){
    Attuatori.find({"_id":req.params.aid}, function(err, attuatori){
      var child;
      var cmd = "python /home/pi/domotica/lib/attuatori.py setStato "+req.body.Appliance+" --stato "+req.body.stato;
      console.log(cmd);
      child = exec(cmd, function (error, stdout, stderr) {
        if(err)
          res.json("Errore :"+stderr)
        else
          res.json("Stdout:"+stdout+",Stderr:"+stderr)
      });
    });
});

router.route('/:aid/getStato')
.get(function(req, res, next){
    Attuatori.find({"_id":req.params.aid}, function(err, attuatori){
      var child;
      var cmd = "python /home/pi/domotica/lib/attuatori.py getStato "+req.params.aid;
      console.log(cmd);
      child = exec(cmd, function (error, stdout, stderr) {
        if(err)
          res.json("Errore :"+stderr)
        else
          res.json({"Stdout":stdout,"Stderr":stderr})
      });
    });
});

module.exports = router;
