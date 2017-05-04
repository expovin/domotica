var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var controllers = new Schema ({ 

	"NomeProcedura" : {
        type : String
    },

	"NomeFunzione" : {
        type : String
    },

    "Descrizione" : {
        type : String
    },

    "Parametri" : {
        "gSoglia" : {
            "Descrizione" : {type : String },
            "Tipo" : {type : String},
            "Min" : {type : Number},
            "Max" : {type : Number},
            "Mandatorio" : {type : Boolean}
        },
        "SI" : {
            "Descrizione" : {type : String },
            "Tipo" : {type : String},
            "Min" : {type : Number},
            "Max" : {type : Number},
            "Mandatorio" : {type : Boolean},
            "Default" : {type : String}
        },  
        "gSet" : {
            "Descrizione" : {type : String },
            "Tipo" : {type : String},
            "Mandatorio" : {type : Boolean},
            "Default" : {type : String}
        },
        "gDevice" : {
            "Descrizione" : {type : String },
            "Tipo" : {type : String},
            "Collection" : {type : String},
            "Mandatorio" : {type : Boolean}
        }
    }
});

var collectionName = 'Controllori'
module.exports = mongoose.model('controllers', controllers, collectionName)