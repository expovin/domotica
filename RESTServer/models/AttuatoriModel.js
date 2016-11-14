var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*
var Porta = new Schema ({
    "Numero" : {
        type : Number,
        require : true
    },
    "GPIO" : {
        type : String
    },
    "Appliance" : {
        type : String
    },
    "Stato" : {
        type : Boolean
    }
});
*/
var attuatori = new Schema ({ 

	"Tipo" : {
        type : String
    },

	"Produttore" : {
        type : String
    },

    "Descrizione" : {
        type : String
    },

    "Sito" : {
        type : String
    },

    "Image" : {
        type : String
    },

    "Datasheet" : {
        type : String
    },    

    "Porte" : [ObjectId],

    "Prefix" : {
        type : String,
        require
    },

    "Connessione" : {
        type : Number,
        require
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

	"dataUltimaModifica" : {
        type : Date
    }
});

var collectionName = 'Attuatori'
module.exports = mongoose.model('attuatori', attuatori, collectionName)