var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Lettura = new Schema ([{

    "DataPrimoInserimento" : {
        type : Date,
        require : true
    },
    "DataUltimoAggiornamento" : {
        type : Date,
        require : true
    },
    "lettura" : {
        type: Number
    },
    "idSensore" : {
        type : String,
        require : true
    }

}]);

var LettureSensori = new Schema ({ 

	"Periodo" : {
        type : String
    },

	"Letture" : [Lettura]
});

var collectionName = 'LettureSensori'
module.exports = mongoose.model('LettureSensori', LettureSensori, collectionName)