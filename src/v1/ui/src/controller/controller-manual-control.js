'use strict';
angular
.module( 'app.controller.manualcontrol', [
                                      'ngMaterial',
                                      'ngMessages',
                                      'colorpicker.module', // colorpicker
                                      'rzModule', // slider
                                      'material.svgAssetsCache',
                                      'ui.bootstrap',
                                      'jsonFormatter'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.2')


// // // // // // // // // // // // // // // // // // // // // // // // //
// #2 Manual Control
app.controller('ControlController', function($scope, $log, $rootScope, $http, $timeout, $uibModal) {

    $rootScope.currentPage = $rootScope.mainPages[2];

    $log.debug("ControlController");


    $scope.uriPraefix = '/api/v1';

    // $scope._bars = [
    //   A1 : {},
    //   A2 : {},
    //   A3 : {},
    //   B1 : {},
    //   B2 : {},
    //   B3 : {},
    //   C1 : {},
    //   C2 : {},
    //   C3 : {}
    // ];

    $scope.bars = {
      'cols': ['A', 'B', 'C'],
      'rows':[
      { 'number' : 1,
        'cols': [
          { 'name': 'A1',
            'class': 'md-fab md-primary md-hue-2',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
          { 'name': 'B1',
            'class': 'md-fab md-primary',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
          { 'name': 'C1',
            'class': 'md-fab md-primary md-hue-1',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
        ]
      },
      { 'number' : 2,
        'cols': [
          { 'name': 'A2',
            'class': 'md-fab md-primary md-hue-2',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
          { 'name': 'B2',
            'class': 'md-fab md-primary',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
          { 'name': 'C2',
            'class': 'md-fab md-primary md-hue-1',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
        ]
      },
      { 'number' : 3,
        'cols': [
          { 'name': 'A3',
            'class': 'md-fab md-primary md-hue-2',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
          { 'name': 'B3',
            'class': 'md-fab md-primary',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
          { 'name': 'C3',
            'class': 'md-fab md-primary md-hue-1',
            'position': 0,
            'animation': { 'id': '', 'name': 'switch-off', 'color': 'rgba(255,255,255,0.5)', 'speed': 0, },
            'object': {},
            'active': false
          },
        ]
      },
    ],
    'defaultColumnClasses': ['md-fab md-primary md-hue-2', 'md-fab md-primary', 'md-fab md-primary md-hue-1']
  };

  // Default slider configuration
  $scope.verticalSlider = {
        value: 0,
        options: {
            floor: 0,
            ceil: 100,
            vertical: true,
            showSelectionBar: true,
            step: 5,
            getSelectionBarColor: function(value) { return 'rgb(63,81,181)'; },
            getPointerColor: function(value) { return 'rgb(63,81,181)'; },
            translate: function(value) { return value + ' %'; }
        }
    };
    $scope.horizontalSlider = {
          value: 0,
          options: {
              floor: 0,
              ceil: 100,
              vertical: false,
              showSelectionBar: true,
              step: 1,
              getSelectionBarColor: function(value) { return 'rgb(63,81,181)'; },
              getPointerColor: function(value) { return 'rgb(63,81,181)'; },
              translate: function(value) { return value + ' %'; }
          }
      };

// --- Get available bars ------------------------------------------------------

$scope.getBars = function() {
    var url = $scope.uriPraefix + '/bars';
    console.log('GET '+ url);
    $http({method: 'GET' , url: url}).
        success(function(data, status) {
          console.log(data);

          data.objects.forEach(function(bar, i, a) {
            $scope.bars.rows.forEach(function(row, j, b) {
              row.cols.forEach(function(item, k, c) {
                console.log(bar.label__c +' - '+ item.name +' = '+ (bar.label__c == item.name));
                if (bar.label__c == item.name) {
                  $scope.bars.rows[j].cols[k].object = bar; // full object
                  $scope.bars.rows[j].cols[k].position = bar.position__c;

                  $scope.bars.rows[j].cols[k].animation.id = bar.animation__c;

                  var hex = hex2rgb('#'+bar.color__c);
                  var brightness = (parseInt(bar.brightness__c) / 100);

                  $scope.bars.rows[j].cols[k].animation.color = 'rgba('+hex.r+','+hex.g+','+hex.b+','+brightness+')';

                  $scope.bars.rows[j].cols[k].animation.speed = bar.animation_speed__c;

                  $scope.bars.rows[j].cols[k].active = true;

                  console.log($scope.bars.rows[j].cols[k]);
                }
              });
            });
          });


        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });
};

$scope.getBars();

// --- Get animations ----------------------------------------------------------

  $scope.animations = [ 'None' ];
  $scope._animations = [];

  var url = $scope.uriPraefix + '/animations';
  console.log('GET '+ url);
  $http({method: 'GET' , url: url}).
      success(function(data, status) {
        console.log(data);

        $scope._animations = data.objects;
        var anis = [];
        data.objects.forEach(function(animation, i, a) {
          anis.push(animation.name__c);
        });
        console.log(anis);
        $scope.animations = anis;
      }).
      error(function(data, status) {
        console.log(data || "Request failed");
    });

// --- Stepper Modes -----------------------------------------------------------

$scope.stepperModes = [
  { 'step': 'full', 'speed': '100 %' },
  { 'step': 'half', 'speed': '50 %' },
  { 'step': 'quarter', 'speed': '25 %' },
  { 'step': 'eigthth', 'speed': '12.5 %' }
];

// --- Initialization ----------------------------------------------------------

  // Initialize
  $scope.isBarSelected = false;
  $scope.selectedBar = '';
  $scope.barPosition = 0; // Position Slider Model
  $scope.barColor = ''; // Color of selectedBar

$scope.isBarReceived = false;
$scope.isAnimationReceived = false;

    // 1. Select bar
  $scope.selectBar = function (bar) {

    $scope.isBarReceived = false;
    $scope.isAnimationReceived = false;

    $scope.isMoveRequestSend = false;
    $scope.isMoveResponseReceived = false;

    $scope.moveRequest = {};
    $scope.moveRequest.text = '';
    $scope.moveRequest.i2c = '';

    $scope.moveResponse = {};
    $scope.moveResponse.json = {};

    $scope.isAnimationRequestSend = false;
    $scope.isAnimationResponseReceived = false;

    $scope.animationRequest = {};
    $scope.animationRequest.text = '';

    $scope.animationResponse = {};
    $scope.animationResponse.json = {};

    $scope.isTokenReceived = false;
    $scope.isTokenValid = false;
    $scope.token = {};


    $log.debug("Selected Bar: "+ bar.name);
    $scope.selectedBar = bar;
    $log.debug("Selected Bar Position: "+ bar.position);
    $scope.barPosition = bar.position; // Set Slider Value

    // GET animation
    var url = $scope.uriPraefix + '/animations/'+$scope.selectedBar.animation.id;
    console.log('GET '+ url);
    $http({method: 'GET' , url: url}).
        success(function(data, status) {
          console.log(data);

          $scope.isAnimationReceived = true;

          if (data._success && data.object) {
            $scope.horizontalSlider.value = data.object.animation_speed__c;
            $scope.barAnimation = data.object.name__c; // LED Animation
          } else {
            $scope.barAnimation = "";
            $scope.horizontalSlider.value = 0;
          }

          $scope.refreshSlider();
        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });

    // GET token
    var url = $scope.uriPraefix + '/status/'+$scope.selectedBar.name.toLowerCase();
    console.log('GET '+ url);
    $http({method: 'GET' , url: url}).
        success(function(data, status) {
          console.log(data);

          $scope.isTokenReceived = true;

          if (data._success && data.object.label__c) {
            $scope.isTokenValid = true;       
            $scope.token = data.object;
          }
        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });


    $scope.isBarSelected = true;

    $log.debug("Selected Bar Color: "+ bar.animation.color);
    $scope.barColor = bar.animation.color; // Set Color

    $log.debug("Selected Animation: "+ bar.animation.name);
    $scope.animation = bar.animation.name; // Set Animation

    $log.debug("Selected Animation Speed: "+ bar.animation.speed);
    $scope.animationSpeed = bar.animation.speed; // Set Animation Duration

    // reset bar classes
    for(var i=0; i < $scope.bars.rows.length; i++) {
      for(var j=0; j < $scope.bars.rows[i].cols.length; j++) {
        $scope.bars.rows[i].cols[j].class = $scope.bars.defaultColumnClasses[j];
      }
    }
    // highlight selected bar
    $scope.selectedBar.class = 'md-fab';

    $scope.refreshSlider();

    $scope.isBarReceived = true;
  };

  // 2. Set bar position
  $scope.refreshSlider = function () {
     $timeout(function () {
         $scope.$broadcast('rzSliderForceRender');
     });
   };

   // Refresh pointer position
   $scope.refreshSlider();

   $scope.barStepperMode = 'half';


// --- SEND MOVE ---------------------------------------------------------------

$scope.isMoveRequestSend = false;
$scope.isMoveResponseReceived = false;

$scope.moveRequest = {};
$scope.moveRequest.text = '';
$scope.moveRequest.i2c = '';

$scope.moveResponse = {};
$scope.moveResponse.json = {};

$scope.sendMove = function () {
    $log.debug(">> MOVE: Position = "+$scope.barPosition+ ", Stepper Mode: "+ $scope.barStepperMode);

    $scope.isMoveRequestSend = false;
    $scope.isMoveResponseReceived = false;

    $scope.moveRequest = {};
    $scope.moveRequest.text = '';
    $scope.moveRequest.i2c = '';

    $scope.moveResponse = {};
    $scope.moveResponse.json = {};



    var uri = $scope.uriPraefix + '/move/'
       + $scope.selectedBar.name.toLowerCase() + '/' // :barReceiver
       + $scope.barPosition + '/' // :position
       + $scope.barStepperMode; // :speed

    $log.debug(uri);
    $scope.moveRequest.text = uri;

    $http({method: 'GET' , url: uri}).
        success(function(data, status) {

          $log.debug(data);
          $scope.moveResponse.json = data;
          $scope.isMoveResponseReceived = true;
        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });

    $scope.isMoveRequestSend = true;
};

// -----------------------------------------------------------------------------

     // 3. Colorpicker
     $scope.changeColor = function (){
          $log.debug("Selected color: " + $scope.colorStyle);
    };



    $scope.selectAnimation = function (animation) {
         $log.debug("Selected animation: " + animation);
    };

    $scope.isAnimationRequestSend = false;
    $scope.isAnimationResponseReceived = false;

    $scope.animationRequest = {};
    $scope.animationRequest.text = '';

    $scope.animationResponse = {};
    $scope.animationResponse.json = {};



    // 4. Send Request
    $scope.sendAnimation = function () {
      $scope.isAnimationRequestSend = false;
      $scope.isAnimationResponseReceived = false;

      $scope.animationRequest = {};
      $scope.animationRequest.text = '';

      $scope.animationResponse = {};
      $scope.animationResponse.json = {};



         var color = rgb2hex($scope.barColor);
         $log.debug(color);
         var brightness = rgba2brigthness($scope.barColor);
         $log.debug(brightness + "%");

         $log.debug(">> ANIMATION: Name: "+$scope.barAnimation.toLowerCase()+", Color: #"+color+", Brightness: "+ brightness+" %");

         var uri = $scope.uriPraefix + '/animation/'
            + $scope.selectedBar.name.toLowerCase() + '/' // :barReceiver
            + $scope.barAnimation.toLowerCase() + '/' // :animation
            + color + '/' // :color
            + brightness + '/' // :brightness
            + $scope.animationSpeed; // :speed

            $log.debug(uri);
            $scope.animationRequest.text = uri;


         $http({method: 'GET' , url: uri}).
             success(function(data, status) {
               $log.debug(data);
               $scope.animationResponse.json = data;

               $scope.isAnimationResponseReceived = true;
             }).
             error(function(data, status) {
               console.log(data || "Request failed");
           });

       $scope.isAnimationRequestSend = true;
    };


});

// #0033ff -> hexToRgb("#0033ff").g = 51
function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+(\.\d{1,2})?)[\s+]?/i);

 if (rgb[5] == null) { rgb[5] = 0; }

 return (rgb && rgb.length === 5) ? "" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) :

   (rgb && rgb.length === 6) ? "" +
   ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function rgba2brigthness(rgba){
 rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+(\.\d{1,2})?)[\s+]?/i);

 if (rgba[5] == null) { rgba[5] = 0; }

 return (rgba && rgba.length === 5) ? ("" + parseInt(rgba[4])) :
        (rgba && rgba.length === 6) ? ("" + parseInt(rgba[4]*100)) : '';
}
