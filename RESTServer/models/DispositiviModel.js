var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var dispositivi = new Schema ({
    "AttuatoreId": {
        type : ObjectId
    },
    "NumeroPorta" : {
        type : Number,
        require : true
    },
    "GPIO" : {
        type : String
    },
    "Dispositivo" : {
        type : String
    },
    "Stato" : {
        type : Boolean
    }
});


var collectionName = 'Dispositivi'
module.exports = mongoose.model('dispositivi', dispositivi, collectionName)