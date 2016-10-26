var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


// Schema Zona, viene ripetuto in Array per ogni zona nelle Policy di Irrigazione
var Zona = new Schema ({
    // Id Identificativo della zona da irrigare
    "zoneId" : {
      type : String,
      require : true
    },  
    // Soglia minima (espressa in litri/mq) al di sotto della quale la zona
    // non viene irrigata, il calcolo verrà rifatto il giorno successivo
    "SogliaLitriIrrigazioneMq" : {
      type : Number,
      min : 0,
      max : 10,
      default : 5,
      require : true
    },
    // Estensione espressa in metri quadri della zona di riferimento
    "Mq" : {
      type : Number,
      min : 0,
      max : 500,
      default : 10,
      require : true
    },
    // Portata dell'impianto espressa in litri / sec per la zona di riferimento
    "Portata_lsec" : {
      type : Number,
      min : 0,
      max : 10,
      default : 0.1,
      require : true
    },
    // Il parametro timing viene utilizzato in fase di forzatura irrigazione
    // Esprime il tempo in minuti in cui la zona di riferimento deve rimanere 
    // attiva
    "Timing" : {
      type : Number,
      min : 0,
      max : 15,
      default : 5,
      require : true
    },
    // Il parametro Litri viene utilizzato in fase di forzatura, è un alternativa
    // al parametro timing, ed esprime quanti litri la zona di riferimento deve
    // erogare. Il calcoo del tempo viene fatto tenendo conto della portata e
    // dell'estensione della zona.
    "Litri" : {
      type : Number,
      min : 0,
      max : 500,
      default : 100,
      require : true
    }

});


/*
    SEZIONE IRRIGAZIONE
    Questa sezione contiene tutti i parametri relativi alla domotizzazione 
    dell'impianto di irrigazione
*/
var Irrigazione = new Schema ({
  // Icona identificativa della sezione config.
    "glyphicon" : {
      type : String,
      require : true,
      default : "glyphicon-tree-conifer"
    },

    "glyphicon-color" : {
      type : String,
      require : true,
      default : "green"
    },

    // Indirizzo IP della scheda relay che attiva le elettrovalvole
    "Relay Board IP" : {
      type : String,
      require : true
    },
    // Porta di comunicazione su protocollo UDP con la scheda Relay
    "Relay Board Port" : {
      type : Number,
      require : true
    },
    // Parte iniziale del messaggio fisso per tutte le porte
    "Message Prefix" : {
      type : String,
      require : true
    },    
    // Array di numeri. Ciascun numero rappresenta i minuti da attendere prima
    // di riprovare la riconnessione alla scheda Relay nel caso questa non
    // rispondesse
    "Retry" : [Number],
    // Parametro di debug, di defould vale 60 (num di secondi in un minuto). Nel
    // caso di debug in cui bisogna restringere i tempi di attesa e' possibile
    // agire su questo parametro
    "NumSec" : {
      type : Number,
      require : true
    },
    // Prametro forse deprecato - DA VERIFICARE
    "Soglia Irrigazione" : {
      type : Number,
      require : true
    },
    // Questa variabile attiva o meno la porta common (#8) che chiude il circuito
    // Quando true il circuito non è chiuso quindi è possibile simulare un ciclo
    // completo di irrigazione senza irrigare veramente
    "Debug" : {
      type : Boolean,
      require : true
    },
    // Esprime in numero di secondi il timeout di rete dopo aver inviato un 
    // comando alla scheda di rete
    "socket timeout" : {
      type : Number,
      require : true
    },
    // Prefisso del messaggio UDP verso scheda Relay per chiudere tutte le 
    // elettrovalvole
    "Message Stop" : {
      type : String,
      require : true
    },
    // Buffer di ricevimento messaggio via UDP
    "Recv From Buffer" : {
      type : Number,
      require : true
    },
    // La sezione Polocy irrigazione contiene tutti i parametri per le 3 diverse 
    // policy di irrigazione
    // Sara' oggetto di verifica alla prossima release
    "PolicyIrrigazione" : {
      // Indica la modalita' di irrigazione
      //  1 - A tempo
      //  2 - A litri
      //  3 - Smart      
      "Selected" : {
        type : Number,
        min : 1,
        max : 3,
        default : 3,
        require : true
      },
      // Offset di ore da calcolare dopo l'alba per iniziare a calcolare la
      // temperatura media della giornata
      "OffsetAlbaOre" : {
        type : Number,
        min : 0,
        max : 6,
        default : 1,
        require : true
      },
      // Offset di ore prima del tramonto per la fine del calcolo della 
      // temperatura media della giornata
      "OffsetTramontoOre" : {
        type : Number,
        min : 0,
        max : 6,
        default : 1,
        require : true
      },
      // Levello minimo di acqua da irrigare per metro quadro
      "AcquaMinMq" : {
        type : Number,
        min : 0.1,
        max : 10,
        default : 4,
        require : true
      },
      // Livello massimo di acqua da irrigare per metro quadro
      // Il calcolo dell'acqua effettiva da irrigare sara' fatto tenendo conto
      // della temperatura media e del vento tracciato nei giorni precedenti
      // Sara' compreso sempre tra il minimo e massimo qui definito
      "AcquaMaxMq" : {
        type : Number,
        min : 0.1,
        max : 10,
        default : 6,
        require : true
      },
      // Temeperatura minima a ci corrispondera' l'irrigazione con acqua minima
      "TempMin" : {
        type : Number,
        min : 0,
        max : 40,
        default : 19,
        require : true
      },
      // Temperatura massima a cui corrispondera' l'irrigazione con acqua massima
      "TempMax" : {
        type : Number,
        min : 0,
        max : 40,
        default : 30,
        require : true
      },
      // Velocita' massima vento in corrispondenza della quale verra' aggunto 
      // una quantita' aggiuntiva di acqua
      "VentoMax" : {
        type : Number,
        min : 0,
        max : 100,
        default : 20,
        require : true
      },
      // Quantita' aggiuntiva di acqua da aggiungere in caso di vento
      "AcquaOffsetVentoMq" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },
      // Su quanti giorni verra' calcolato il fabisogno d'acqua in base alla
      // temperatura media registrata
      "GiorniCalcoloMediaTemperatura" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },
      // Su quanti giorni verra' calcolato il fabbisogno d'acqua in base al vento
      // registrato
      "GiorniCalcoloMediaVento" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },
      // Quanto giorni tengo conto per pioggie cadute e acqua irrigata
      "GiorniCalcoloTotaleAcqua" : {
        type : Number,
        min : 0,
        max : 10,
        default : 3,
        require : true
      },
      // Array di zone precedentemente definito
      "Zone" : [Zona]

    }
    
});


/*
    SEZIONE ACQUARIO
    Questa sezione contiene tutti i parametri relativi al controllo e gestione
    dell'acquario
*/
var Acquario = new Schema ({ 

  // Icona identificativa della sezione config.
    "glyphicon" : {
      type : String,
      require : true,
      default : "glyphicon-tint"
    },

    "glyphicon-color" : {
      type : String,
      require : true,
      default : "blue"
    },

      "getTemp" : {

         // Nome univoco del modulo, per scopi futuri
         "Module Name" : {
            type : String,
            require : true
         },
         // Per evitare errore di lettura il sensore effettua piu letture ed 
         // elimina gli outlayers. Delle letture restanti effettua una media.
         // Questo parametro definisce il numero di letture da effettuare
         "Number of Consecutive Reading" : {
            type : Number,
            min : 0,
            require : true
         },
         // Esprime in secondi il tempo di attesa tra una lettura e la successiva
         "Time between Consecutive Reading" : {
            type : Number,
            min : 0.1,
            max : 10,
            default : 1,
            require : true
         },
         // Tempo espresso in secondi tra una serie di letture (e conseguente 
         // registrazione) e la serie di letture successiva (nuova registrazione)
         "Interval between Reading" : {
            type : Number,
            min : 10,
            max : 900,
            default : 300,
            require : true
         },
         // La sezione Temp definisce il controllo di temperatura dell'Acquario
         "Temp" : {
             // Indica la temperatura minima al di sotto della quale il controller
             // accenderà il riscaldatore
             "Min" : {
                type : Number,
                min : 10,
                default : 24,
                require : true
             },
             // Indica la temperatura massima al di sopra della quale verranno
             // prese eventuali precauzioni (al piu warning via mail)
             "Max" : {
                type : Number,
                max : 40,
                default : 28,
                require : true
             },
            // Indica la differenza di temperatura tra l'accensione e lo 
            // spegnimento dei sistempi di controllo 
            // Es. a 24° (min) viene acceso riscaldatore che restera' acceso fino
            // al raggiungimento della min+delta quindi 24,5 (idem per max)
             "Delta Trigger" : {
                type : Number,
                max : 2,
                default : 0.5,
                require : true
             },
             // Indica la differenza di temperatura tra le letture per tracciarla
             // come storia nel DB. Piccole variazioni poco significative (al di
             // sotto di questa soglia), non vengono considerate significative
             "Delta Trace" : {
                type : Number,
                max : 2,
                default : 0.1,
                require : true
             }
         }

      },

      // Questa sezione viene utilizzata per la gestione delle luci dell'acquario
      "switchLight" : {
         // Nome univoco del modulo, per scopi futuri
         "Module Name" : {
            type : String,
            require : true
         }
      }

});


/*
    SEZIONE GPIO
    Questa sezione definisce l'utilizzo delle porte del GPIO del Raspberry
*/
var GPIO = new Schema ({ 

  // Icona identificativa della sezione config.
    "glyphicon" : {
      type : String,
      require : true,
      default : "glyphicon-random"
    },
    "glyphicon-color" : {
      type : String,
      require : true,
      default : "gray"
    },

      // Pin per il bottone di accensione spegnimento      
     "pushButton" : {
        type : Number,
        min : 1,
        max : 40,
        require : true
     },
     // Pin per il controllo del relay di accensione/spegnimento luci
     "Lights" : {
        type : Number,
        min : 1,
        max : 40,
        require : true
     },
     // Pin per il controllo del relay di accensione/spegnimento riscaldatore
     "Heater" : {
        type : Number,
        min : 1,
        max : 40,
        require : true
     }
});

/*
    SEZIONE Weather Info
    Questa sezione definisce l'utilizzo delle API OWM per recuperare le 
    informazioni meteo
*/
var WeatherInfo = new Schema ({ 

  // Icona identificativa della sezione config.
    "glyphicon" : {
      type : String,
      require : true,
      default : "glyphicon-flash"
    },


    "glyphicon-color" : {
      type : String,
      require : true,
      default : "red"
    },

    // Nome univoco del modulo, per scopi futuri
    "Module Name" : {
      type : String,
      require : true
    },
    // Chiave per la chiamata API a Open Weather Map
    "OWM KEY" : {
      type : String,
      require : true
    },
    // Localita' per la quale viene richiesta le info meteo
    "Place" : {
      type : String,
      require : true
    },
    // Tempo in secondi tra una query e la successiva
    "Interval Query" : {
      type : Number,
      min : 60,
      require : true
    }
});


/*
    SEZIONE email
    Questa sezione riporta tutti i parametri di configurazione dell'email
*/
var email = new Schema ({ 

  // Icona identificativa della sezione config.
    "glyphicon" : {
      type : String,
      require : true,
      default : "glyphicon-envelope"
    },


    "glyphicon-color" : {
      type : String,
      require : true,
      default : "yellow"
    },

      // Username di configurazione email
     "username" : {
        type : String,
        require : true
     },
    // Password di configurazione email
     "password" : {
        type : String,
        require : true
     },
    // Nominativo in From di configurazione email
     "from" : {
        type : String,
        require : true
     },
    // Elenco indirizzi a cui spedire le email
     "to" : {
        type : String,
        require : true
     },
    // SMTP Server di configurazione email
     "smtpServer" : {
        type : String,
        require : true
     },
     "smtpPort" : {
        type : Number,
        min: 1,
        require : true
     },
    // debug level di configurazione email
     "debugLevel" : {
        type : String,
        min: 0,
        require : true
     }
});


var general = new Schema ({ 

  // Icona identificativa della sezione config.
    "glyphicon" : {
      type : String,
      require : true,
      default : "glyphicon-cog"
    },
    
    "Level" : Number,
    "LogLevel" : [
        {
          "id": {
            type : Number,
            require : true
          },
          "Label" : {
            type : String,
            require : true
          },
          "icon" : {
            type : String,
            require : true
          },
          "glyphicon" : {
            type : String,
            require : true
          }
        }
    ], 
});


var config = new Schema ({ 

    // Valore univoco che indica la funzione di questa configurazione. Quella
    // utilizzata dal sistema e' definita come Current
     "Tag" : {
        type : String,
        unique: true,
        require : true
     },
     // Versione del sistema
     "version" : {
        type : String,
        require : true
     },

    // Sezione irrigazione
    "Irrigazione" :  Irrigazione,

    // Sezione controllo Acquario
    "Acquario" : Acquario,

    // Sezione GPIO
    "GPIO" : GPIO,

    // Sezione Weather Info
    "WeatherInfo" : WeatherInfo,

    //Sezione email
    "Email" : email,

    // Sezione General
    "General" : general

},
{
    timestamps: true
});



var collectionName = 'config'
module.exports = mongoose.model('config', config, collectionName)