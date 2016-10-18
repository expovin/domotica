var express = require('express');
var bodyParser = require('body-parser');
var Dispositivi = require('../models/DispositiviModel');
var sys = require('sys')
var exec = require('child_process').exec;

var mongoose = require('mongoose');

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

    Dispositivi.find({}, function(err, dispositivi){
    	if (err) 
    		{ res.json(RC(100,"GET /dispositivi",err)); }
    	else
    		res.json(dispositivi);
    });
})

/*  Il metodo PUT permette di selezionare solo alcune colonne della
    collection da passare nel body con standard MongoDB
*/
.put(function(req, res, next){
    var query = Dispositivi.find({}).select(req.body);
    query.exec(function(err, dispositivi){
      if (err) 
        { res.json(RC(100,"PUT /dispositivi",err)); }
      else
        res.json(dispositivi);
    });
})


/*
	POST
	Il metodo post viene utilizzato per inserire a sistema un nuovo sensore.
	Ritorna l'id del sensore inserito. Questo id dovra' essere utilizzato per
	la registrazione di tutte le letture
*/
.post(function(req, res, next){
    Dispositivi.create(req.body, function(err, dispositivi){
    	if (err) {
    		res.json(RC(300,"POST /dispositivi",err));
    	}
    	else
    	    res.json(RC(200,"POST /dispositivi. Inserito id "+dispositivi._id));
    });
});

/*
  GET
  L'end point con /:uid opera su un sensore specifico
*/
router.route('/attuatore/:aid')
// Recuper delle informazioni di un sensore specifico
.get(function(req, res, next){
    Dispositivi.find({"AttuatoreId":mongoose.Types.ObjectId(req.params.aid)}, function(err, dispositivi){
      if (err) 
        { res.json(RC(100,"GET /dispositivi/"+req.params.aid,err)); }
      else
          res.json(dispositivi);
    });
});



/*
	GET
	L'end point con /:uid opera su un sensore specifico
*/
router.route('/:uid')
// Recuper delle informazioni di un sensore specifico
.get(function(req, res, next){
    Dispositivi.find({"_id":req.params.uid}, function(err, dispositivi){
    	if (err) 
    		{ res.json(RC(100,"GET /dispositivi/"+req.params.uid,err)); }
    	else
       		res.json(dispositivi[0]);
    });
})
/* PUT
   Il metodo put modifica i dettagli di un sensore specifico
*/
.put(function(req, res, next){   	
        // Put the reference in the user detail
	Dispositivi.findOneAndUpdate({"_id":req.params.uid}, req.body, {upsert:true}, 
		function(err, conf){
    	if (err) 
    		{ res.json(RC(300,"PUT /dispositivi/"+req.params.uid,err)); }
    	else
			res.json(RC(200,"POST /dispositivi/"+req.params.uid));
	    
	 });
})

// Il metodo delete cancella un sensore dal sistema
.delete(function(req, res, next){
	var Query = {"_id":req.params.uid};
	Dispositivi.find(Query).remove(function(err,deleted){
		if (err) {
			res.json(RC(500,"DELETE /dispositivi/"+req.params.uid,err));
		}
		else
	    	res.json(RC(200,"DELETE /dispositivi/"+req.params.uid));
	});
});


router.route('/:aid/setStato')
.put(function(req, res, next){
    Dispositivi.find({"_id":req.params.aid}, function(err, dispositivi){
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
.put(function(req, res, next){
    Dispositivi.find({"_id":req.params.aid}, function(err, dispositivi){
      var child;
      var cmd = "python /home/pi/domotica/lib/attuatori.py getStato "+req.body.Appliance;
      console.log(cmd);
      child = exec(cmd, function (error, stdout, stderr) {
        if(err)
          res.json("Errore :"+stderr)
        else
          res.json("Stdout:"+stdout+",Stderr:"+stderr)
      });
    });
});

module.exports = router;
