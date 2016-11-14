var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var GPIOPort = new Schema ({ 

    "Port" : {
        type : Number,
        require : true
    },
    "Label" : {
        type : String,
        require : true
    },
    "isPower" : {
        type : Boolean,
        require : true,
        default : false
    },
    "isGND" : {
        type : Boolean,
        require : true,
        default : false
    },
    "Power" : {
        type : Number,
        require : true,
        default : 0
    },
    "AlternateFunction" : {
        type : String,
        require : true,
        default : "N/A"
    },
    "ConnectedTo" : {
        type : Schema.Types.ObjectId,
        require : false
    }
});

var GPIOTemplate = new Schema ({ 

	"model" : {
        type : String,
        require : true
    },

	"link" : {
        type : String
    },

    "image" : {
        type : String
    },

    "Specs" : {
        "version" : {
            type : Number,
            default : 1.0
        },
        "SoC" : {
            type : String
        },
        "CPU" : {
            type : String
        },
        "GPU" : {
            type : String
        },
        "RAM" : {
            type : "String"
        },
        "Networking" : {
            "Ethernet" : {
                type : String
            },
            "Wireless" : {
                type : String
            }
        },
        "Bluetooth" : {
            type : String
        },
        "Storage" : {
            type : String
        },
        "Ports" : [String],
        "SupplyRange" : {
            type : String
        },
        "Interface" : {
            type : String
        }
    },
    "Ports" : [GPIOPort]
});

var collectionName = 'modelTemplate'
module.exports = mongoose.model('modelTemplate', GPIOTemplate, collectionName)