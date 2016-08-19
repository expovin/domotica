var express = require('express');
var router = express.Router();

var document ={};

/* GET users listing. */
router.route('/')

    .post(function(req, res, next){
        document = req.body;
        res.json(document);
    })



	.get(function(req, res, next) {
		res.json(document);
	    });


module.exports = router;
