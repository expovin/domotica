'use strict';

angular.module('DomoHome')

        .factory('ListRowsFactory',[function($resource,baseURL,port) {

            var listRowFac = {};
            var selectedRow={};

                listRowFac.setStatus = function(status){
                    console.log("Funzione cambia stato, stato = "+status);

                    switch(status) {

                        /*  Stato cancellazione record, vengono mostrati i pulsanti di
                            cancellazione, vengono nascosti i tasti Cancella/Aggiungi
                            Viene mostrato il tasto Fatto.
                        */
                        case 0:
                            $(".myTagCrossDelete").css("display","table-cell");
                            $(".myTagButtonDelete").css("display","inline");
                            $(".myTagButtonRegular").css("display","none");
                            $(".myTagButtonInfo").css("display","none");
                            break;

                        /*  Caso cancellazione completata, vengono nascosti i tasti di
                            cancellazione, viene nascosto il pulsante fatto, viene mostrato
                            il pulsante Cancella/Aggiungi
                        */
                        case 1:
                            $(".myTagCrossDelete").css("display","none");
                            $(".myTagButtonDelete").css("display","none");
                            $(".myTagButtonRegular").css("display","inline");
                            $(".myTagButtonInfo").css("display","table-cell");
                            break;

                        /*  Stato dettaglio record.
                        */
                        case 2:
                            $('#dettaglioSelezionato').css("display","block");
                        //    $('#inserimentoNuovoSensore').css("display","none");
                            $('#dettaglioLettureSensore').css("display","none");


                    }
                };

                listRowFac.setSelectedRow = function(id) {
                    console.log("Setto riga selezionata");
                    selectedRow=id;
                    console.log(selectedRow);
                };

                listRowFac.getSelectedRow = function() {
                    console.log("Ritorno record slezionato");
                    console.log(selectedRow);
                    return selectedRow;
                }



                return listRowFac;

        }])

;
