var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Zona = new Schema ({

    "zoneId" : {
      type : String,
      require : true
    },  

    "SogliaLitriIrrigazioneMq" : {
      type : Number,
      min : 0,
      max : 10,
      default : 5,
      require : true
    },

    "Mq" : {
      type : Number,
      min : 0,
      max : 500,
      default : 10,
      require : true
    },

    "Portata_lsec" : {
      type : Number,
      min : 0,
      max : 10,
      default : 0.1,
      require : true
    },

    "Timing" : {
      type : Number,
      min : 0,
      max : 15,
      default : 5,
      require : true
    },

    "Litri" : {
      type : Number,
      min : 0,
      max : 500,
      default : 100,
      require : true
    }

});



var Irrigazione = new Schema ({

    "Relay Board IP" : {
      type : String,
      require : true
    },

    "Relay Board Port" : {
      type : Number,
      require : true
    },

    "Message Prefix" : {
      type : String,
      require : true
    },    

    "Retry" : [Number],

    "NumSec" : {
      type : Number,
      require : true
    },

    "Soglia Irrigazione" : {
      type : Number,
      require : true
    },

    "Debug" : {
      type : Boolean,
      require : true
    },

    "socket timeout" : {
      type : Number,
      require : true
    },

    "Message Stop" : {
      type : String,
      require : true
    },

    "Recv From Buffer" : {
      type : Number,
      require : true
    },

    "PolicyIrrigazione" : {

      "Selected" : {
        type : Number,
        min : 1,
        max : 3,
        default : 3,
        require : true
      },

      "OffsetAlbaOre" : {
        type : Number,
        min : 0,
        max : 6,
        default : 1,
        require : true
      },

      "OffsetTramontoOre" : {
        type : Number,
        min : 0,
        max : 6,
        default : 1,
        require : true
      },

      "AcquaMinMq" : {
        type : Number,
        min : 0.1,
        max : 10,
        default : 4,
        require : true
      },

      "AcquaMaxMq" : {
        type : Number,
        min : 0.1,
        max : 10,
        default : 6,
        require : true
      },

      "TempMin" : {
        type : Number,
        min : 0,
        max : 40,
        default : 19,
        require : true
      },

      "TempMax" : {
        type : Number,
        min : 0,
        max : 40,
        default : 30,
        require : true
      },

      "VentoMax" : {
        type : Number,
        min : 0,
        max : 100,
        default : 20,
        require : true
      },

      "AcquaOffsetVentoMq" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },

      "GiorniCalcoloMediaTemperatura" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },

      "GiorniCalcoloMediaVento" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },

      "GiorniCalcoloTotaleAcqua" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },

      "Zone" : [Zona]

    }
    
});


var config = new Schema ({ 

   "Irrigazione" :  [Irrigazione]
});



var collectionName = 'config'
module.exports = mongoose.model('config', config, collectionName)