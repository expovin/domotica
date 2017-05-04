var express = require('express');
var bodyParser = require('body-parser');
var Controllers = require('../models/controllersModel');
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

    Controllers.find({}, function(err, controllers){
    	if (err) 
    		{ res.json(RC(100,"GET /controllers",err)); }
    	else
    		res.json(controllers);
    });
});

router.route('/:ContId')
.get(function(req, res, next){

    Controllers.find({"_id":req.params.ContId}, function(err, controllers){
    	if (err) 
    		{ res.json(RC(100,"GET /controllers",err)); }
    	else
    		res.json(controllers);
    });
});

module.exports = router;