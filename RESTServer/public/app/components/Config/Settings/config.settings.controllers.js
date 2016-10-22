'use strict';

angular.module('DomoHome') 

    .controller('SettingsControllers', ['$scope','configFactory', '$location',
        function($scope,configFactory,$location) {

        var config = {};
        $scope.sections = {};
        var save = {};

        $scope.isActive = function (viewLocation) { 
            return $location.path().includes(viewLocation);
        };

        $scope.applyNewSettings = function(){
            console.log($scope.newSettings);
        }

        $scope.resetCampi = function(){
            $scope.sections = JSON.parse(JSON.stringify(save));
        }

        var config = configFactory.Config().query(
            function(response) {
            	
		        $scope.sections = response[0];
                

		        delete $scope.sections['_id'];
		        delete $scope.sections['Tag'];
		        delete $scope.sections['version'];
		        save = JSON.parse(JSON.stringify($scope.sections));

            },
            function(response){
                console.log('Errore')
            }
        );


    }])  	
    /*  Controller utilizzato per la generazione e la gestione della lista di una 
        "Collection" arbitraria
    */
    .controller('leftPaneControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

		    function htmlbodyHeightUpdate(){
				var height3 = $( window ).height()
				var height1 = $('.nav').height()+50
				var height2 = $('.main').height()
				if(height2 > height3){
					$('html').height(Math.max(height1,height3,height2)+10);
					$('body').height(Math.max(height1,height3,height2)+10);
				}
				else
				{
					$('html').height(Math.max(height1,height3,height2));
					$('body').height(Math.max(height1,height3,height2));
				}
				
			}
			$(document).ready(function () {
				htmlbodyHeightUpdate()
				$( window ).resize(function() {
					htmlbodyHeightUpdate()
				});
				$( window ).scroll(function() {
					var height2 = $('.main').height()
		  			htmlbodyHeightUpdate()
				});
			});


    }])

    .controller('generalSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('acquarioSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {

        console.log($scope.sections['Acquario']);

    }])

    .controller('GPIOSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('irrigazioneSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])


    .controller('weatherInfoSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams) {


    }])

    .controller('emailSettingsControllers', ['$scope','attuatorFactory','ListRowsFactory','$stateParams','$modal', 
        function($scope,attuatorFactory,ListRowsFactory,$stateParams,$modal) {

        //    $scope.newSettings.Email = $scope.sections.Email;



    }])


    .controller('ModalChangePasswordController', ['$scope','$modalInstance','param','attuatorFactory', 
        function($scope,$modalInstance,param,attuatorFactory) {

            $scope.changePassword = {};

            $scope.cancel = function () {
                console.log("Cancel");
                $modalInstance.dismiss('cancel');
            }


    }])



 ;