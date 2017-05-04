utils = {

	'getSessionId' : function (stream, callback) {

	  stream=String(stream);

	  start=stream.indexOf("session=");
	  console.log("Trovato indice :"+start);
	  da=start+8;
	  a=da+18;
	  sessionId=stream.substring(da,a);
	  console.log("Trovata sessione :"+sessionId);

	  callback(sessionId);
	},

	'getStatoAree' : function (stream, callback) {
		console.log("Recupero stato Aree");
		Aree = ["TUTTE LE AREE","Area 1: PERIMETRO", "Area 2: SENSORI INTERNI", "Area 3: SENSORI ESTERNI", "Area 4: BOX"];
		stream=String(stream);
		StatoAree={};

		for(var Area in Aree) {
			console.log("Ricerca di "+Aree[Area]);

			start=stream.indexOf(Aree[Area]);
			newStr=stream.substring(start+(Aree[Area].length)+5);
			fine=newStr.indexOf("</td>");
			inizio=newStr.indexOf(">");
			console.log(inizio+" "+fine);
			stato=newStr.substring(inizio+1,fine);
			StatoAree[Aree[Area]]=stato;
		}
		callback(StatoAree);
	},


	'getIngressi' : function (stream, callback){
		console.log("Recupero stato Ingressi");

		Ingressi = ["PORTA INGRESSO", "FIN SX SALA", "FIN DX SALA", "FIN CUCINA", "FIN BAGNO PT", "IR SALA",
					"IR CUCINA", "IR BAGNO PT", "IR EXT INGRESSO", "IR EXT CUCINA", "IR EXT CAMERETTA",
					"IR EXT CAM MAT", "CM BASCULANTE", "IR BOX", "PORTA P-1 BOX", "PERS MATRIM.", "PERS CAMERETT.",
					"PERS STUDIO", "PERS BAGNO P1", "IR MATRIMON", "IR CAMERETTA", "IR STUDIO"];
		stream=String(stream);
		StatoIngressi={};

		for(var ing in Ingressi){
			console.log("Ricerca dell'ingresso "+Ingressi[ing]);
			StatoIngressi[Ingressi[ing]]=[]

			start=stream.indexOf(Ingressi[ing]);
			newStr=stream.substring(start+(Ingressi[ing].length)+5);	

			for(var i=0; i< 5; i++){
				fine=newStr.indexOf("</TD>");
				inizio=newStr.indexOf(">");
				console.log(inizio+" "+fine);
				stato=newStr.substring(inizio+1,fine);

				if(i>2)
					stato=pulisci(stato);

				if(i!=2)
					StatoIngressi[Ingressi[ing]].push(stato);
				newStr=newStr.substring(fine+5);
			}


			
		}
		callback(StatoIngressi);

	},

	'getAlerts' : function (stream, callback){
		console.log("Recupero stato Ingressi");

		Ingressi = ["Guasto Alimentazione","Guasto Batteria Centrale","Guasto Alimentatore centrale"];

		stream=String(stream);
		StatoIngressi={};

		for(var ing in Ingressi){
			console.log("Ricerca dell'ingresso "+Ingressi[ing]);
			StatoIngressi[Ingressi[ing]]=[]

			start=stream.indexOf(Ingressi[ing]);
			newStr=stream.substring(start+(Ingressi[ing].length)+5);	

			for(var i=0; i< 2; i++){
				fine=newStr.indexOf("</TD>");
				inizio=newStr.indexOf(">");
				console.log(inizio+" "+fine);
				stato=newStr.substring(inizio+1,fine);
				stato=pulisci(stato);
				StatoIngressi[Ingressi[ing]].push(stato);
				newStr=newStr.substring(fine+5);
			}
		}
		callback(StatoIngressi);
	},

	'getLogs' : function (stream, callback){
		console.log("Recupero Log");

		stream=String(stream);
		Log=[];

		start=stream.indexOf("<TABLE ");
		newStr=stream.substring(start+12);

		var i= 0;
		do{
			i+=1;
			start=newStr.indexOf("<TD>");
			stop=newStr.indexOf("</TD>");

			row = newStr.substring(start+4,stop);
			Log.push(row);
			newStr=newStr.substring(stop+5);

			var fine = newStr.substring(5,13);
			console.log(i+":"+stop+" - "+fine+" : "+newStr.substring(0,stop+20)+" : "+row);

			if(i>999999)
				break;

		}while(fine.localeCompare("</TABLE>"))
		console.log("Numero di righe : "+i);
		callback(Log);
	}

}

function pulisci(str){
	console.log("Pulizia Steringa "+str);
	strStart=str.indexOf(">");
	InnewStr=str.substring(strStart+1);
	console.log("NewStr "+InnewStr+" strStart :"+strStart);
	if(InnewStr[0]=="<"){
		console.log("Salto la prima istanza");
		strStart=InnewStr.indexOf(">");
		InnewStr=InnewStr.substring(strStart+1);
		console.log("NewStr "+InnewStr+" strStart :"+strStart);
	}
	strStop=InnewStr.indexOf("</");
	console.log("strStop "+strStop);
	console.log("Ritorno "+InnewStr.substring(0,strStop));
	return(InnewStr.substring(0,strStop))
}


module.exports = utils;