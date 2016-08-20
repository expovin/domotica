/*
	ReturnCodes.js

	Questa funzione riceve in ingresso un codice di ritorno e restituisce il
	JSON da ritornare all'utente finale con descrizione breve e lunga
	del codice di errore con eventuali suggerimenti
*/

module.exports =  function ReturnCode(rc, callingFunction, err) {

        var Myerr = "N/A";

		switch(rc) {
		    case 200:
		        var shortMsg = "OK";
		        var longMsg = "Funzione eseguita correttamente"
		        break;
		    case 300:
		        var shortMsg = "KO";
		        var longMsg = "Errore generico"
		        var Myerr = err
		        break;
		    default:
		        var shortMsg = "KO";
		        var longMsg = "Errore non riconosciuto"
		} 

		var rc = {

			"code" : rc,
			"short Message" : shortMsg,
			"long Message" : longMsg,
			"err" : Myerr
		};

		return (rc);
}