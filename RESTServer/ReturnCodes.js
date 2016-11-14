/*
	ReturnCodes.js

	Questa funzione riceve in ingresso un codice di ritorno e restituisce il
	JSON da ritornare all'utente finale con descrizione breve e lunga
	del codice di errore con eventuali suggerimenti
*/

module.exports =  function ReturnCode(rc, callingFunction, err) {

        //var Myerr = "N/A";

		switch(rc) {
			case 100:
				var shortMsg ="Error getting objet";
				var longMsg = "Errore nel recupero informazioni per funzione "+callingFunction;
		    case 200:
		        var shortMsg = "OK";
		        var longMsg = "Funzione "+callingFunction+" eseguita correttamente";
		        break;
		    case 300:
		        var shortMsg = "Error modifying object";
		        var longMsg = "Errore nella modifica funzione "+callingFunction;
		        break;
		    case 400:
		        var shortMsg = "Error creating object";
		        var longMsg = "Errore nella creazione funzione "+callingFunction;
		        break;
		    case 500:
		        var shortMsg = "Error deleting object";
		        var longMsg = "Errore nella cancellazione funzione "+callingFunction;
		        break;
		    default:
		        var shortMsg = "KO";
		        var longMsg = "Errore non riconosciuto";
		} 

		var rc = {

			"code" : rc,
			"short Message" : shortMsg,
			"long Message" : longMsg,
			"err" : err
		};

		return (rc);
}