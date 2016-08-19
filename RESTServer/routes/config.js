var express = require('express');
var bodyParser = require('body-parser');
var MyConf = require('../models/configModel');
var router = express.Router();

var document ={};

/* GET all config parameters */
router.route('/')
.get(function(req, res, next){

    MyConf.find({"Tag":"Current"}, function(err, conf){
      if(err) throw err;
       res.json(conf);
    });
})


.put(function(req, res, next){   	
        // Put the reference in the user detail
	MyConf.findOneAndUpdate({"Tag":"Current"}, req.body, {upsert:true}, function(err, conf){
	    if(err) throw err;
		res.json(conf);
	    
	 });
});


/*
.put(function(req, res, next){   	
        // Put the reference in the user detail
	MyConf.findOne({"Tag":"Current"},  function(err, currConf){
	    if(err) throw err;
	    currConf = req.body;
	    currConf.save(function(err,newConf){
	    	res.json(newConf);
	    })

	 });
});
*/
module.exports = router;
