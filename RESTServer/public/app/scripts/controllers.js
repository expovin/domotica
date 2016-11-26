'use strict';
angular.module('DomoHome')

.constant('CONFIG',{
        BASE_REST_URL :'http://raspytest:3000'
})

    .directive('bootstrapSwitch', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          $(element).bootstrapSwitch({
            onSwitchChange: function(event, state) {
              scope.$apply(function() {
                ngModelCtrl.$setViewValue(state);
              });
            }
          });
        }
      }
    })

    .controller('HomeController', ['$scope','$timeout', function($scope,$timeout) {

            $scope.clock = "loading clock..."; // initialise the time variable
            $scope.tickInterval = 1000 //ms

            var tick = function() {
                $scope.clock = Date.now() // get the current time
                $timeout(tick, $scope.tickInterval); // reset the timer
            }

            // Start the timer
            $timeout(tick, $scope.tickInterval);

    }])

    .controller('SettingsController', ['$scope','$timeout', function($scope,$timeout) {


            function isObject ( obj ) {
               return obj && (typeof obj  === "object");
            }

            function isArray ( obj ) { 
              return isObject(obj) && (obj instanceof Array);
            }
        

    }])

;
