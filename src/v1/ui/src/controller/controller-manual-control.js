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

    // Default slider configuration
    $scope.movementSpeedSlider = {
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
      $scope.animationSpeedSlider = {
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
        $scope.lightingBrightnessSlider = {
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

$scope.bars = {};
$scope.barSides = [];

$scope.getBars = function() {

  $http({method: 'GET', url: './src/model/bars-3x3.json'})
  .success(function(data) {

     $scope.bars = data; // Get JSON
     //console.log(data);

     var url = $scope.uriPraefix + '/bars?state=active';
     console.log('GET '+ url);
     $http({method: 'GET', url: url}) // Get available bars (Salesforce.com)
       .success(function(data, status) {
         //console.log(data);

         data.objects.forEach(function(bar, i, a) {
           $scope.bars.rows.forEach(function(row, j, b) {
             row.cols.forEach(function(item, k, c) {
               //console.log(bar.label__c +' - '+ item.name +' = '+ (bar.label__c == item.name));
               if (bar.label__c == item.name) {
                 $scope.bars.rows[j].cols[k].object = bar; // full object
                 $scope.bars.rows[j].cols[k].position = bar.position__c;

                 $scope.bars.rows[j].cols[k].animation.id = bar.animation__c;

                 var hex = hex2rgb('#'+bar.color__c);
                 var brightness = (parseInt(bar.brightness__c) / 100);

                 $scope.bars.rows[j].cols[k].animation.color = 'rgba('+hex.r+','+hex.g+','+hex.b+','+brightness+')';

                 $scope.bars.rows[j].cols[k].animation.speed = bar.animation_speed__c;

                 $scope.bars.rows[j].cols[k].active = true;

                 //console.log($scope.bars.rows[j].cols[k]);
               }
             });
           });
         });


         $http({method: 'GET', url: './src/model/side-lighting.json'})
         .success(function(data) {
            $scope.barSides = data; // Get JSON
          })
          .error(function(data) {
            console.log('ERROR: Loading side-lighting.json');
          });


       })
       .error(function(data, status) {
         console.log(data || "Request failed");
     });
   })
  .error(function(data) {
    console.log('ERROR: '+data);
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
        //console.log(data);

        $scope._animations = data.objects;
        var anis = [];
        data.objects.forEach(function(animation, i, a) {
          anis.push(animation.name__c);
        });
        //console.log(anis);
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
$scope.isSideReceived = false;

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

    $scope.isSideReceived = false;


    $log.debug("Selected Bar: "+ bar.name);
    $scope.selectedBar = bar;
    $log.debug("Selected Bar Position: "+ bar.position);
    $scope.barPosition = bar.position; // Set Slider Value

    // GET animation
    var url = $scope.uriPraefix + '/animations/'+$scope.selectedBar.animation.id;
    console.log('GET '+ url);
    $http({method: 'GET' , url: url}).
        success(function(data, status) {
          //console.log(data);

          $scope.isAnimationReceived = true;

          if (data._success && data.object) {
            $scope.animationSpeedSlider.value = data.object.animation_speed__c;
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
          //console.log(data);

          $scope.isTokenReceived = true;

          if (data._success && data.object.label__c) {
            $scope.isTokenValid = true;
            $scope.token = data.object;
          }
        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });

    // GET side A
   var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_a__c;
   console.log('GET '+ url);
   $http({method: 'GET' , url: url})
      .success(function(dataA) {

        //console.log(dataA);

        var i = 0;
        for (var key in dataA.object) {
          if (key.indexOf("led_") > -1 && dataA.object[key] != null && typeof dataA.object[key] != 'undefined') {
              //console.log(i+': '+dataA.object[key]+' -> '+$scope.barSides[10 - i].led+' = '+hex2rgb('#'+dataA.object[key]));
              var hex = hex2rgb('#'+dataA.object[key]);
              $scope.barSides[10 - i].colorA = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.5)';
              i++;
          }
        }

       // GET side B
       var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_b__c;
       console.log('GET '+ url);
       $http({method: 'GET' , url: url})
          .success(function(data, status) {

            //console.log(data);

            var i = 0;
            for (var key in data.object) {
              if (key.indexOf("led_") > -1 && dataA.object[key] != null && typeof dataA.object[key] != 'undefined') {
                  //console.log(i+': '+data.object[key]+' -> '+$scope.barSides[10 - i].led+' = '+hex2rgb('#'+data.object[key]));
                  var hex = hex2rgb('#'+data.object[key]);
                  $scope.barSides[10 - i].colorB = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.5)';
                  i++;
              }
            }

            // GET side C
           var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_c__c;
           console.log('GET '+ url);
           $http({method: 'GET' , url: url})
              .success(function(data, status) {

                //console.log(data);

                var i = 0;
                for (var key in data.object) {
                  if (key.indexOf("led_") > -1 && dataA.object[key] != null && typeof dataA.object[key] != 'undefined') {
                      //console.log(i+': '+data.object[key]+' -> '+$scope.barSides[10 - i].led+' = '+hex2rgb('#'+data.object[key]));
                      var hex = hex2rgb('#'+data.object[key]);
                      $scope.barSides[10 - i].colorC = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.5)';
                      i++;
                  }
                }

                // GET side D
               var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_d__c;
               console.log('GET '+ url);
               $http({method: 'GET' , url: url})
                  .success(function(data, status) {

                    //console.log(data);

                    var i = 0;
                    for (var key in data.object) {
                      if (key.indexOf("led_") > -1 && dataA.object[key] != null && typeof dataA.object[key] != 'undefined') {
                          //console.log(i+': '+data.object[key]+' -> '+$scope.barSides[10 - i].led+' = '+hex2rgb('#'+data.object[key]));
                          var hex = hex2rgb('#'+data.object[key]);
                          $scope.barSides[10 - i].colorD = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.5)';
                          i++;
                      }
                    }

                    $scope._barSides = $scope.barSides; // copy
                    $scope.barSidesInitialized = true;

                    // $scope.$watch('barSides', function() {
                    //
                    //   if ($scope.barSidesInitialized) $scope.barSidesInitialized = false;
                    //   else {
                    //
                    //     var i = 0;
                    //     $scope.barSides.forEach(function(item, index, array) {
                    //       // side A changed?
                    //       if ($scope.barSides[index].colorA != $scope._barSides[index].colorA) {
                    //         console.log(index+': A changed from '+$scope._barSides[index].colorA+' to '+$scope.barSides[index].colorA);
                    //       }
                    //       if ($scope.barSides[index].colorB != $scope._barSides[index].colorB) {
                    //         console.log(index+': B changed from '+$scope._barSides[index].colorB+' to '+$scope.barSides[index].colorB);
                    //       }
                    //       if ($scope.barSides[index].colorC != $scope._barSides[index].colorC) {
                    //         console.log(index+': C changed from '+$scope._barSides[index].colorC+' to '+$scope.barSides[index].colorC);
                    //       }
                    //       if ($scope.barSides[index].colorD != $scope._barSides[index].colorD) {
                    //         console.log(index+': D changed from '+$scope._barSides[index].colorD+' to '+$scope.barSides[index].colorD);
                    //       }
                    //
                    //       i++;
                    //     });
                    //
                    //   }
                    //
                    // }, true);

                    $scope.isSideReceived = true;
                    $scope.refreshSlider();
                  })
                  .error(function(data, status) {
                    console.log(data || "Request failed");
                });
              })
              .error(function(data, status) {
                console.log(data || "Request failed");
            });
          })
          .error(function(data, status) {
            console.log(data || "Request failed");
        });

      })
      .error(function(data, status) {
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

          for (var key in data.object) {

            if (data.object[key] != null)
              if (key == 'animation__c') {
                data.object[key] = 'http://localhost:8080/api/v1/animations/'+data.object[key];
              } else if (key.indexOf("side_") > -1) {
                data.object[key] = 'http://localhost:8080/api/v1/sides/'+data.object[key];
              } else if (key == 'device__c') {
                data.object[key] = 'http://localhost:8080/api/v1/devices/'+data.object[key];
              } else if (key == 'app__c') {
                data.object[key] = 'http://localhost:8080/api/v1/apps/'+data.object[key];
              } else if (key == 'token__c') {
                data.object[key] = 'http://localhost:8080/api/v1/tokens/'+data.object[key];
              } else if (key == 'smartphone__c') {
                data.object[key] = 'http://localhost:8080/api/v1/smartphones/'+data.object[key];
              } else if (key == 'bar__c') {
                data.object[key] = 'http://localhost:8080/api/v1/bars/'+data.object[key];
              } else if (key == 'notification__c') {
                data.object[key] = 'http://localhost:8080/api/v1/notifications/'+data.object[key];
              } else if (key == 'invocation__c') {
                data.object[key] = 'http://localhost:8080/api/v1/invocations/'+data.object[key];
              }
          }

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



         var color = rgba2hex($scope.barColor);
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

               for (var key in data.object) {

                 if (data.object[key] != null)
                   if (key == 'animation__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/animations/'+data.object[key];
                   } else if (key.indexOf("side_") > -1) {
                     data.object[key] = 'http://localhost:8080/api/v1/sides/'+data.object[key];
                   } else if (key == 'device__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/devices/'+data.object[key];
                   } else if (key == 'app__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/apps/'+data.object[key];
                   } else if (key == 'token__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/tokens/'+data.object[key];
                   } else if (key == 'smartphone__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/smartphones/'+data.object[key];
                   } else if (key == 'bar__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/bars/'+data.object[key];
                   } else if (key == 'notification__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/notifications/'+data.object[key];
                   } else if (key == 'invocation__c') {
                     data.object[key] = 'http://localhost:8080/api/v1/invocations/'+data.object[key];
                   }
               }

               $scope.animationResponse.json = data;

               $scope.isAnimationResponseReceived = true;
             }).
             error(function(data, status) {
               console.log(data || "Request failed");
           });

       $scope.isAnimationRequestSend = true;
    };


    // -----------------------------------------------------------------------------


    // --- SEND LIGHTING -------------------------------------------------------

    $scope.lightingBrightness = 100;

    $scope.isLightingRequestSend = false;
    $scope.isLightingResponseReceived = true;

    $scope.sendLighting = function () {

        console.log(">> Lighting");

        $scope.isLightingRequestSend = false;
        $scope.isLightingResponseReceived = false;

        var sideA = $scope.selectedBar.object.side_a__c;
        var sideB = $scope.selectedBar.object.side_b__c;
        var sideC = $scope.selectedBar.object.side_c__c;
        var sideD = $scope.selectedBar.object.side_d__c;

        var baseUri = $scope.uriPraefix + '/bars/'
           + $scope.selectedBar.name.toLowerCase() + '/'
           + 'sides';

        // PUT/ UPDATE side A
        var sides = [ 'A', 'B', 'C', 'D' ];
        var sideJson = {
	       "receiver": $scope.selectedBar.object.led__c,
         "sideIds": [ sideA, sideB, sideC, sideD ],
         "sides": [
         // { "name": "A", "led": 1, "color": "ff0000" },
        ]};

        for (var s = 0; s < 4; s++) {
          for (var i = 10; i >= 0; i--) {

            switch (s) {
              case 0: sideJson.sides.push( { "name": sides[s], "led": (i+1), "color": rgba2hex($scope.barSides[10-i].colorA), "brightness": $scope.lightingBrightness } ); break;
              case 1: sideJson.sides.push( { "name": sides[s], "led": (i+1), "color": rgba2hex($scope.barSides[10-i].colorB), "brightness": $scope.lightingBrightness } ); break;
              case 2: sideJson.sides.push( { "name": sides[s], "led": (i+1), "color": rgba2hex($scope.barSides[10-i].colorC), "brightness": $scope.lightingBrightness } ); break;
              case 3: sideJson.sides.push( { "name": sides[s], "led": (i+1), "color": rgba2hex($scope.barSides[10-i].colorD), "brightness": $scope.lightingBrightness } ); break;

              default: break;
            }

          }
        }
        console.log(sideJson);

        $http({method: 'PUT' , url: baseUri, data: { sideJson }}).
            success(function(data) {

              $log.debug(data);
              $scope.isLightingResponseReceived = true;
            }).
            error(function(data, status) {
              console.log(data || "Request failed");
          });

        $scope.isLightingRequestSend = true;
    };

    var addLighting = function(baseUri, side, i, next) {

      var uri = baseUri
          + side                                      // :side
          + '/add/'
          + ($scope.barSides[i].led - 1) + '/'        // :led
          + rgba2hex($scope.barSides[i].colorA) + '/'  // :color
          + $scope.lightingBrightness;                // :brightness

      console.log('GET: '+uri);

      $http({method: 'GET' , url: uri}).
          success(function(data) {

            $log.debug(data);

            if (i < 10) next(baseUri, side, i + 1, addLighting); // add: 0,1,2,3,4,5,6,7,8,9,10
          }).
          error(function(data, status) {
            console.log(data || "Request failed");
        });
    };

    $scope.sendResetLightingDone = true;

    $scope.sendResetLighting = function(side) {

      $scope.sendResetLightingDone = false;

      var uri = $scope.uriPraefix + '/bars/'
         + $scope.selectedBar.name.toLowerCase() + '/'
         + 'sides' + '/'
         + side + '/new';

      $http({method: 'GET' , url: uri}).
          success(function(data) {
            $log.debug("SUCCESS: Reset Side "+side);

            updateSide(side);
            $scope.sendResetLightingDone = true;
          }).
          error(function(data, status) {
            console.log(data || "Request failed");
        });

    };

    var updateSide = function(side) {

      // GET side
      if (side == 'A') {
         var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_a__c;
         console.log('GET '+ url);
         $http({method: 'GET' , url: url})
            .success(function(data, status) {
              var i = 0;
              for (var key in data.object) {
                if (key.indexOf("led_") > -1 && data.object[key] != null && typeof data.object[key] != 'undefined') {
                    var hex = hex2rgb('#'+data.object[key]);
                    $scope.barSides[10 - i].colorA = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.6)';
                    i++;
                }
              }

            })
            .error(function(data, status) {
              console.log(data || "Request failed");
          });
      } else if (side == 'B') {
         var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_b__c;
         console.log('GET '+ url);
         $http({method: 'GET' , url: url})
            .success(function(data, status) {
              var i = 0;
              for (var key in data.object) {
                if (key.indexOf("led_") > -1 && data.object[key] != null && typeof data.object[key] != 'undefined') {
                    var hex = hex2rgb('#'+data.object[key]);
                    $scope.barSides[10 - i].colorB = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.6)';
                    i++;
                }
              }

            })
            .error(function(data, status) {
              console.log(data || "Request failed");
          });
      } else if (side == 'C') {
         var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_c__c;
         console.log('GET '+ url);
         $http({method: 'GET' , url: url})
            .success(function(data, status) {
              var i = 0;
              for (var key in data.object) {
                if (key.indexOf("led_") > -1 && data.object[key] != null && typeof data.object[key] != 'undefined') {
                    var hex = hex2rgb('#'+data.object[key]);
                    $scope.barSides[10 - i].colorC = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.6)';
                    i++;
                }
              }

            })
            .error(function(data, status) {
              console.log(data || "Request failed");
          });
      } else if (side == 'D') {
         var url = $scope.uriPraefix + '/sides/'+$scope.selectedBar.object.side_d__c;
         console.log('GET '+ url);
         $http({method: 'GET' , url: url})
            .success(function(data, status) {
              var i = 0;
              for (var key in data.object) {
                if (key.indexOf("led_") > -1 && data.object[key] != null && typeof data.object[key] != 'undefined') {
                    var hex = hex2rgb('#'+data.object[key]);
                    $scope.barSides[10 - i].colorD = 'rgba('+hex.r+','+hex.g+','+hex.b+', 0.6)';
                    i++;
                }
              }

            })
            .error(function(data, status) {
              console.log(data || "Request failed");
          });
      }
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

function rgba2hex(rgb){
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

function rgb2hex(rgb){
 rgb = rgb.match(/^rgb?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?\)[\s+]?/i);

 if (rgb[4] == null) { rgb[4] = 0; }

 return (rgb && rgb.length === 4) ? "" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) :

   (rgb && rgb.length === 5) ? "" +
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
