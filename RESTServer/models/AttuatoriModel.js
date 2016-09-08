var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var attuatori = new Schema ({ 

	"Tipo" : {
        type : String
    },

	"Modello" : {
        type : String
    },

    "Sito" : {
        type : String
    },

    "TracciaStoria" : {
        type : Boolean,
        require : true,
        default : false
    },

	"dataInserimento" : {
        type : Date,
        require : true,
        default: Date.now
    },

	"dataUltimoAggiornamento" : {
        type : Date
    },

	"ultimaLettura" : {
        type : Number
    }
});

var collectionName = 'Sensori'
module.exports = mongoose.model('sensori', sensori, collectionName)