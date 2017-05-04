utils = {

	getMensaCookie : function (str, callback) {
		return(str.split(';')[0])
	},

	getMensaData : function (stream, callback) {

		// Recupero il residuo saldo
		start=stream.indexOf("&euro;");
		newStr=stream.substring(start+7);
		fine=newStr.indexOf("</div>");

		var Saldo = newStr.substring(0,fine);
		console.log("Saldo :"+Saldo);

		//Recupero la refezione
		start=newStr.indexOf("refezione");
		newStr=newStr.substring(start+10);
		start=newStr.indexOf("/>");
		fine=newStr.indexOf("</td>");

		var Refezione = newStr.substring(start+2,fine);
		console.log("Refezione :"+Refezione);

		callback({'Saldo':Saldo, 'Refezione':Refezione});


	}
}

module.exports = utils;