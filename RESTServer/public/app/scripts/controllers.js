'use strict';
angular.module('DomoHome')

    .config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {

        var opts = {
          lines: 13 // The number of lines to draw
        , length: 38 // The length of each line
        , width: 4 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 0.5 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1.5 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
        };

        usSpinnerConfigProvider.setDefaults(opts);
    }])

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

    .controller('DashController', ['$scope', function($scope) {


    }])

;
