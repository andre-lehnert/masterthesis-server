'use strict';


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



angular
.module( 'app.controller.editor', [
                                      'ngMaterial',
                                      'ngMessages',
                                      'ngDragDrop',
                                      'colorpicker.module', // colorpicker
                                      'rzModule', // slider
                                      'material.svgAssetsCache',
                                      'ui.bootstrap'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.1.0')

// // // // // // // // // // // // // // // // // // // // // // // // //
// #1 Sequence Editor
.controller('EditorController', function($rootScope, $scope, $http, $log, $mdToast, $timeout, $uibModal) {

  $rootScope.currentPage = $rootScope.mainPages[1];
  $log.debug("EditorController");

  $scope.isLoading = true;
  $scope.isOpen = false;

  $scope.uriPraefix = '/api/v1';

  $scope.validateHEX = function(hex) {
    // var sNum = hex.replace('#','');
    // return (typeof sNum === "string") && sNum.length === 6
    //      && ! isNaN( parseInt(sNum, 16) );
    if (typeof hex == 'undefined') return false;

    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  };

  var str_pad_left = function (string,pad,length) {
      return (new Array(length+1).join(pad)+string).slice(-length);
  };

  $scope.formatTime = function(value) {
    if (value > 60) {
      var minutes = Math.floor(value / 60);
      var seconds = value - minutes * 60;
      return minutes +' min '+ str_pad_left(seconds, '0', 2) + ' s';
    } else {
      return value + ' s';
    }
  };

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
  $scope.timeSlider = {
        value: 1,
        options: {
            floor: 1,
            ceil: 600,
            vertical: false,
            showSelectionBar: true,
            step: 1,
            getSelectionBarColor: function(value) { return 'rgb(63,81,181)'; },
            getPointerColor: function(value) { return 'rgb(63,81,181)'; },
            translate: function(value) {
              return $scope.formatTime(value);
        }
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


  // Overview: Show all sequences
  $scope.isOverview = true;
  $scope.isAddPage = false;
  $scope.pages = {
    'addMovement' : false,
    'addAnimation' : false,
    'addLighting' : false,
    'addLevelLighting' : false,
    'addDelay' : false,
  };

  $scope.isSaved = false;
  $scope.sequences = [];

  // Selected sequence
  $scope.sequence = {};
  $scope.sequence.title = "";
  $scope.sequence.actions = [];

  // Overview: Load sequence list
  $scope.getSquences = function() {
    $scope.isLoading = true;

    var url = $scope.uriPraefix + '/sequences';
    console.log('GET '+ url);
    $http({method: 'GET', url: url})
      .success(function(data, status) {
        console.log(data);

        if (data._success)
        data.objects.forEach(function(item,array,position) {
          $scope.sequences.push(item);
        });

        $scope.isLoading = false;
      })
      .error(function(err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Request failed: '+url)
            .position('top right')
            .hideDelay(3000)
        );
      });


  };

  $scope.getSquences();

  // Overview: Select sequence
  $scope.selectSequence = function(sequence) {
    $scope.isOverview = false;

    $scope.sequence = angular.fromJson(sequence);
    $scope.sequence.operations__c = angular.fromJson(sequence.operations__c.replaceAll("'", "\""));
    console.log("SEQUNCE: "+ $scope.sequence);

    // Available Bars and Sides
    $scope.getBars();
    $scope.getAnimations();
  };

  // Overview: Add new sequence
  $scope.addSequence = function() {
    $scope.isOverview = false;
    $scope.sequence = {
      'title__c': '',
      'operations__c': []
    };

    // Available Bars and Sides
    $scope.getBars();

    $scope.getAnimations();
  };


  // --- Get available bars ------------------------------------------------------

  $scope.bars = {};
  $scope.barSides = [];
  $scope.isBarSelected = false;

  $scope.getBars = function() {

    $scope.isLoading = true;

    $http({method: 'GET', url: './src/model/bars-3x3.json'})
    .success(function(data) {

       $scope.bars = data; // Get JSON
       //console.log(data);

       var url = $scope.uriPraefix + '/bars' //?state=active'; //TODO
       console.log('GET '+ url);
       $http({method: 'GET', url: url}) // Get available bars (Salesforce.com)
         .success(function(data, status) {
           console.log(data);

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


          //  $http({method: 'GET', url: './src/model/side-lighting.json'})
          //  .success(function(data) {
          //     $scope.barSides = data; // Get JSON
          //   })
          //   .error(function(data) {
          //     $mdToast.show(
          //       $mdToast.simple()
          //         .textContent('Can´t get Side model!')
          //         .position('top right')
          //         .hideDelay(3000)
          //     );
          //   });

          $scope.isLoading = false;
         })
         .error(function(data, status) {
           $mdToast.show(
             $mdToast.simple()
               .textContent('Request failed: '+url)
               .position('top right')
               .hideDelay(3000)
           );
       });
     })
    .error(function(data) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Can´t get Bar model!')
          .position('top right')
          .hideDelay(3000)
      );
     });
  };

  // --- Get animations ----------------------------------------------------------

    $scope.animations = [ 'None' ];
    $scope._animations = [];

    $scope.getAnimations = function() {

      $scope.isLoading = true;

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
            //console.log(anis);
            $scope.animations = anis;

            $scope.isLoading = false;
          }).
          error(function(data, status) {
            console.log(data || "Request failed");
        });
    };





// --- Initialization ----------------------------------------------------------

// --- Stepper Modes -----------------------------------------------------------

  $scope.stepperModes = [
    { 'step': 'full', 'speed': '100 %' },
    { 'step': 'half', 'speed': '50 %' },
    { 'step': 'quarter', 'speed': '25 %' },
    { 'step': 'eigthth', 'speed': '12.5 %' }
  ];


  $scope.resetParameter = function() {
    $scope.isBarSelected = false;
    $scope.selectedBar = '';
    $scope.barColor = ''; // Color of selectedBar
    $scope.isPositionReceived = false;
    $scope.isBarReceived = false;
    $scope.isPositionReceived = true;
    $scope.isAnimationReceived = false;
    $scope.isSideReceived = false;

    $scope.barPosition = 0;
    $scope.barStepperMode = 'half';

    $scope.barAnimation = '';
    $scope.barColor = '#ffffff'
    $scope.animationSpeed = 100;
    $scope.animationBrightness = 100;

    $scope.isSideSelected = false;
    $scope.isOperationSelected = false;
    $scope.isLedSelected = false;

    $scope.sideSelect = {
      'A': { 'selected': false, 'class': "md-raised md-subhead" },
      'B': { 'selected': false, 'class': "md-raised md-subhead" },
      'C': { 'selected': false, 'class': "md-raised md-subhead" },
      'D': { 'selected': false, 'class': "md-raised md-subhead" },
    };

    $scope.patternOperation = {
      'New': { 'selected': false, 'class': "md-raised md-subhead" },
      'Add': { 'selected': false, 'class': "md-raised md-subhead" },
      'Remove': { 'selected': false, 'class': "md-raised md-subhead" },
    };

    $scope.patternLeds = [
      { 'number': 1, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 2, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 3, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 4, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 5, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 6, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 7, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 8, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 9, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 10, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 11, 'selected': false, 'class': "md-fab md-mini md-raised" },
    ];

    $scope.patternColor = '#000000';


    $scope.delay = 1;

    $scope.selectedBar = {};
    $scope.isPositionReceived = false;
    $scope.isBarSelected = false;
    $scope.isBarReceived = false;

    // reset bar classes
    if (typeof $scope.bars.rows != 'undefined')
    for(var i=0; i < $scope.bars.rows.length; i++) {
      for(var j=0; j < $scope.bars.rows[i].cols.length; j++) {
        $scope.bars.rows[i].cols[j].class = $scope.bars.defaultColumnClasses[j];
      }
    }

    $scope.isEditing = false;
  };

  // Bug not fixed https://github.com/angular-slider/angularjs-slider/issues/116
  $scope.refreshSlider = function () {
   $timeout(function () {
       $scope.$broadcast('rzSliderForceRender');
   });
  };

  // Refresh pointer position
  $scope.refreshSlider();

  // Initialize
  $scope.resetParameter();

// ----------------------------------------------------------------------------------------

    // 1. Select bar
  $scope.selectBar = function (bar) {


    $log.debug("Selected Bar: "+ bar.name);
    $scope.selectedBar = bar; // <--
    $scope.barPosition = bar.position; // Set Slider Value
    $scope.isPositionReceived = true;

    // don´t change position
    if ($scope.isEditing) {
      $scope.barPosition = $scope.editObject.position;


    }

    // reset bar classes
    for(var i=0; i < $scope.bars.rows.length; i++) {
      for(var j=0; j < $scope.bars.rows[i].cols.length; j++) {
        $scope.bars.rows[i].cols[j].class = $scope.bars.defaultColumnClasses[j];
      }
    }
    // highlight selected bar
    $scope.selectedBar.class = 'md-fab';

    if (typeof bar.stepperMode != 'undefined')
      $scope.barStepperMode = bar.stepperMode;

    $scope.isBarSelected = true;
    $scope.refreshSlider();
  };


  // ---> Lighting Pattern


  $scope.selectSide = function(side) {

    $scope.sideSelect = {
      'A': { 'selected': false, 'class': "md-raised md-subhead" },
      'B': { 'selected': false, 'class': "md-raised md-subhead" },
      'C': { 'selected': false, 'class': "md-raised md-subhead" },
      'D': { 'selected': false, 'class': "md-raised md-subhead" },
    };

    $scope.sideSelect[side] = { 'selected': true, 'class': "md-accent md-raised md-subhead" };

    $scope.isSideSelected = true;
  };

  $scope.selectPatternOperation = function(operation) {

    $scope.patternOperation = {
      'New': { 'selected': false, 'class': "md-raised md-subhead" },
      'Add': { 'selected': false, 'class': "md-raised md-subhead" },
      'Remove': { 'selected': false, 'class': "md-raised md-subhead" },
    };

    $scope.patternOperation[operation] = { 'selected': true, 'class': "md-accent md-raised md-subhead" };

    $scope.isOperationSelected = true;
  };

  $scope.selectPatternLed = function(num) {

    $scope.patternLeds = [
      { 'number': 1, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 2, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 3, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 4, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 5, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 6, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 7, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 8, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 9, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 10, 'selected': false, 'class': "md-fab md-mini md-raised" },
      { 'number': 11, 'selected': false, 'class': "md-fab md-mini md-raised" },
    ];

    $scope.patternLeds[num].selected = true;
    $scope.patternLeds[num].class = "md-fab md-mini md-raised md-accent";

    $scope.isLedSelected = true;
  };


  $scope.readableColor = function(hexTripletColor) {
    if (typeof hexTripletColor == 'undefined') return '#000000';

    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    if (color > 12000000) return "#000000";
    else return "#ffffff";
  };


 //---------------------------------------------------------------------

  // Add Page: Move
  $scope.addMove = function() {

    $scope.resetParameter();

    $scope.isAddPage = true;
    $scope.pages = {
      'addMovement' : true,
      'addAnimation' : false,
      'addLighting' : false,
      'addLevelLighting' : false,
      'addDelay' : false,
    };

    $scope.refreshSlider();
  };

  $scope.addAnimation = function() {



    if (!$scope.isEditing) {
      $scope.resetParameter();
      $scope.barAnimation = $scope.animations[1];
    }

    $scope.isAddPage = true;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : true,
      'addLighting' : false,
      'addLevelLighting' : false,
      'addDelay' : false,
    };

    $scope.refreshSlider();
  };
  $scope.addLighting = function() {

    $scope.resetParameter();

    $scope.isAddPage = true;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : false,
      'addLighting' : true,
      'addLevelLighting' : false,
      'addDelay' : false,
    };

    $scope.refreshSlider();

  };
  $scope.addLevelLighting = function() {

    $scope.resetParameter();

    $scope.isAddPage = true;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : false,
      'addLighting' : false,
      'addLevelLighting' : true,
      'addDelay' : false,
    };
    //TODO
  };
  $scope.addDelay = function() {

    $scope.resetParameter();

    $scope.isAddPage = true;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : false,
      'addLighting' : false,
      'addLevelLighting' : false,
      'addDelay' : true,
    };
    //TODO
  };

  $scope.goBack = function() {
    $scope.isOverview = true;
    $scope.sequence = {
      'title__c': '',
      'operations__c': []
    };

    $scope.sequences = [];
    $scope.getSquences();
  };

  $scope.goBackDetail = function() {
    $scope.isOverview = false;
    $scope.isAddPage = false;
  };


  // ---------------------------------------------------------------------------
  // Saving
  // ---------------------------------------------------------------------------
  $scope.saveMove = function() {


    console.log("SAVE MOVE: existing object = "+$scope.isEditing+", object id: "+ $scope.editId);

    if (typeof $scope.selectedBar == 'undefined' || $scope.selectedBar == '' || typeof $scope.selectedBar.name == 'undefined' || $scope.selectedBar.name == '') {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid bar...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if (typeof $scope.barPosition != 'number' || $scope.barPosition < 0 || $scope.barPosition > 100) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid target position')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    var found = false;
    $scope.stepperModes.forEach(function(mode) {
      if (mode.step == $scope.barStepperMode) found = true;
    });

    if ( ! found) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid movement speed')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ($scope.isEditing) {

      for (var i = 0; i < $scope.sequence.operations__c.length; i++) {

        // just update parameter
        if ($scope.sequence.operations__c[i].id == $scope.editId) {
          $scope.sequence.operations__c[i].bar = $scope.selectedBar.name;
          $scope.sequence.operations__c[i].position = $scope.barPosition;
          $scope.sequence.operations__c[i].speed = $scope.barStepperMode;
        }
      }

    } else {

      $scope.sequence.operations__c.push(
        {
          'id': $scope.sequence.operations__c.length + 1,
          'drag': true,
          'type': 'operation',
          'bar': $scope.selectedBar.name,
          'function': 'move',
          'position': $scope.barPosition,
          'speed': $scope.barStepperMode,
          'isProceeding': false
        }
      );
    }

    console.log($scope.sequence);

    $scope.isOverview = false;
    $scope.isAddPage = false;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : false,
      'addLighting' : false,
      'addLevelLighting' : false,
      'addDelay' : false,
    };

    $scope.resetParameter();

    $scope.save();
  };

  $scope.editMove = function(operation) {

    $scope.addMove();

    $scope.bars.rows.forEach(function(row, j, b) {
      row.cols.forEach(function(item, k, c) {
        console.log(operation.bar+" == "+item.name+" -> "+(operation.bar == item.name))
        if (operation.bar == item.name) {
          item.position = operation.position;
          item.stepperMode = operation.speed;
          $scope.selectBar(item);
          $scope.selectBar(item);
        }
      });
    });

    $scope.isEditing = true;

  };

  // ##############################################################

  $scope.saveAnimation = function() {

    console.log("SAVE ANIMATION: existing object = "+$scope.isEditing+", object id: "+ $scope.editId);

    if (typeof $scope.selectedBar == 'undefined' || $scope.selectedBar == '' || typeof $scope.selectedBar.name == 'undefined' || $scope.selectedBar.name == '') {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid bar...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ($scope.animations.indexOf($scope.barAnimation) < 0) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid animation')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ( ! $scope.validateHEX($scope.barColor)) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid color hex code')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if (typeof $scope.animationSpeed != 'number' || $scope.animationSpeed < 0 || $scope.animationSpeed > 100) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid animation speed')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }


    if (typeof $scope.animationBrightness != 'number' || $scope.animationBrightness < 0 || $scope.animationBrightness > 100) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid brightness')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }




    if ($scope.isEditing) {

      for (var i = 0; i < $scope.sequence.operations__c.length; i++) {

        // just update parameter
        if ($scope.sequence.operations__c[i].id == $scope.editId) {
          $scope.sequence.operations__c[i].bar = $scope.selectedBar.name;
          $scope.sequence.operations__c[i].animation = $scope.barAnimation;
          $scope.sequence.operations__c[i].color = $scope.barColor;
          $scope.sequence.operations__c[i].brightness = $scope.animationBrightness;
          $scope.sequence.operations__c[i].speed = $scope.animationSpeed;
        }
      }

    } else {

      $scope.sequence.operations__c.push(
        {
          'id': $scope.sequence.operations__c.length + 1,
          'drag': true,
          'type': 'operation',
          'bar': $scope.selectedBar.name,
          'function': 'animate',
          'animation': $scope.barAnimation,
          'color': $scope.barColor,
          'brightness': $scope.animationBrightness,
          'speed': $scope.animationSpeed,
          'isProceeding': false
        }
      );
    }

    console.log($scope.sequence);

    $scope.isOverview = false;
    $scope.isAddPage = false;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : false,
      'addLighting' : false,
      'addLevelLighting' : false,
      'addDelay' : false,
    };

    $scope.resetParameter();

    $scope.save();
  };

  $scope.editAnimation = function(operation) {

    $scope.addAnimation();

    $scope.bars.rows.forEach(function(row, j, b) {
      row.cols.forEach(function(item, k, c) {
        console.log(operation.bar+" == "+item.name+" -> "+(operation.bar == item.name))
        if (operation.bar == item.name) {

          item.animation = operation.animation;
          $scope.barAnimation = operation.animation;

          item.color = operation.color;
          $scope.barColor = operation.color;

          item.brightness = operation.brightness;
          $scope.animationBrightness = operation.brightness;

          item.speed = operation.speed;
          $scope.animationSpeed = operation.speed;

          $scope.selectBar(item);
          $scope.selectBar(item);
        }
      });
    });

    $scope.isEditing = true;

  };

  // ##############################################################

  $scope.saveLighting = function() {

    console.log("SAVE LIGHTING: existing object = "+$scope.isEditing+", object id: "+ $scope.editId);

    var op = '',
        side = '',
        number = '';

    if (typeof $scope.selectedBar == 'undefined' || $scope.selectedBar == '' || typeof $scope.selectedBar.name == 'undefined' || $scope.selectedBar.name == '') {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid bar...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ($scope.sideSelect.A.selected) side = 'A';
    else if ($scope.sideSelect.B.selected) side = 'B';
    else if ($scope.sideSelect.C.selected) side = 'C';
    else if ($scope.sideSelect.D.selected) side = 'D';
    else {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid side...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ($scope.patternOperation.New.selected) op = 'New';
    else if ($scope.patternOperation.Add.selected) op = 'Add';
    else if ($scope.patternOperation.Remove.selected) op = 'Remove';
    else {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid operation...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }



    $scope.patternLeds.forEach(function(led, array, pointer) {
      if (led.selected)
        number = led.number;
    });


    $scope.patternLeds.forEach(function(led, array, pointer) {
      if (led.selected)
        number = led.number;
    });

    if ( ($scope.patternOperation.Add.selected || $scope.patternOperation.Remove.selected) && (typeof number != 'number' || number < 0 || number > 11)) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid LED level...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ( ! $scope.validateHEX($scope.patternColor)) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid color hex code')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }


      var color = $scope.patternColor; //.replace('#','');

      console.log("Side: "+ side +", operation: "+op+ ", led: "+number+", color: "+color);

      if ($scope.isEditing) {

        for (var i = 0; i < $scope.sequence.operations__c.length; i++) {

          // just update parameter
          if ($scope.sequence.operations__c[i].id == $scope.editId) {
            $scope.sequence.operations__c[i].bar = $scope.selectedBar.name;
            $scope.sequence.operations__c[i].side = side;
            $scope.sequence.operations__c[i].led = number;
            $scope.sequence.operations__c[i].op = op;
            $scope.sequence.operations__c[i].color = color;
          }
        }

      } else {

        $scope.sequence.operations__c.push(
          {
            'id': $scope.sequence.operations__c.length + 1,
            'drag': true,
            'type': 'operation',
            'bar': $scope.selectedBar.name,
            'function': 'lighting',
            'side': side,
            'led': number,
            'op': op,
            'color': color,
            'isProceeding': false
          }
        );
      }

      console.log($scope.sequence);

      $scope.isOverview = false;
      $scope.isAddPage = false;
      $scope.pages = {
        'addMovement' : false,
        'addAnimation' : false,
        'addLighting' : false,
        'addLevelLighting' : false,
        'addDelay' : false,
      };

      $scope.resetParameter();

      $scope.save();
  };

  $scope.editLighting = function(operation) {

    $scope.isChanged = false;
    $scope.isEditing = true;

    $scope.addLighting();

    $scope.bars.rows.forEach(function(row, j, b) {
      row.cols.forEach(function(item, k, c) {
        console.log(operation.bar+" == "+item.name+" -> "+(operation.bar == item.name))
        if (operation.bar == item.name) {

          item.color = operation.color;
          $scope.patternColor = operation.color;

          item.side = operation.side;
          $scope.sideSelect[item.side] = { 'selected': true, 'class': "md-accent md-raised md-subhead" };

          item.op = operation.op;
          $scope.patternOperation[item.op] = { 'selected': true, 'class': "md-raised md-subhead md-accent" };

          item.led = operation.led;
          $scope.patternLeds[item.led - 1] = { 'number': item.led, 'selected': true, 'class': "md-fab md-mini md-raised md-accent" };


          $scope.selectBar(item);

        }
      });
    });

    $scope.isEditing = true;
    $scope.isSideSelected = true;
    $scope.isOperationSelected = true;
    $scope.isLedSelected = true;

  };

  // ##############################################################

  $scope.saveLevelLighting = function() {

    console.log("SAVE LEVEL LIGHTING: existing object = "+$scope.isEditing+", object id: "+ $scope.editId);

    var op = '',
        number = '';

    if (typeof $scope.selectedBar == 'undefined' || $scope.selectedBar == '' || typeof $scope.selectedBar.name == 'undefined' || $scope.selectedBar.name == '') {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid bar...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ($scope.patternOperation.Add.selected) op = 'Add';
    else if ($scope.patternOperation.Remove.selected) op = 'Remove';
    else {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid operation (Add/ Remove)...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    $scope.patternLeds.forEach(function(led, array, pointer) {
      if (led.selected)
        number = led.number;
    });

    if (typeof number != 'number' || number < 0 || number > 11) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid LED level...')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    if ( ! $scope.validateHEX($scope.patternColor)) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('Color: HEX code invalid')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }


      var color = $scope.patternColor; //.replace('#','');

      console.log("Operation: "+op+ ", led: "+number+", color: "+color);

      if ($scope.isEditing) {

        for (var i = 0; i < $scope.sequence.operations__c.length; i++) {

          // just update parameter
          if ($scope.sequence.operations__c[i].id == $scope.editId) {
            $scope.sequence.operations__c[i].bar = $scope.selectedBar.name;
            $scope.sequence.operations__c[i].led = number;
            $scope.sequence.operations__c[i].op = op;
            $scope.sequence.operations__c[i].color = color;
          }
        }

      } else {

        $scope.sequence.operations__c.push(
          {
            'id': $scope.sequence.operations__c.length + 1,
            'drag': true,
            'type': 'operation',
            'bar': $scope.selectedBar.name,
            'function': 'level lighting',
            'led': number,
            'op': op,
            'color': color,
            'isProceeding': false
          }
        );
      }

      console.log($scope.sequence);

      $scope.isOverview = false;
      $scope.isAddPage = false;
      $scope.pages = {
        'addMovement' : false,
        'addAnimation' : false,
        'addLighting' : false,
        'addLevelLighting' : false,
        'addDelay' : false,
      };

      $scope.resetParameter();

      $scope.save();
  };

  $scope.editLevelLighting = function(operation) {

    $scope.isChanged = false;
    $scope.isEditing = true;

    $scope.addLevelLighting();

    $scope.bars.rows.forEach(function(row, j, b) {
      row.cols.forEach(function(item, k, c) {
        console.log(operation.bar+" == "+item.name+" -> "+(operation.bar == item.name))
        if (operation.bar == item.name) {

          item.color = operation.color;
          $scope.patternColor = operation.color;

          item.op = operation.op;
          $scope.patternOperation[item.op] = { 'selected': true, 'class': "md-raised md-subhead md-accent" };

          item.led = operation.led;
          $scope.patternLeds[item.led - 1] = { 'number': item.led, 'selected': true, 'class': "md-fab md-mini md-raised md-accent" };


          $scope.selectBar(item);

        }
      });
    });

    $scope.isEditing = true;
    $scope.isOperationSelected = true;
    $scope.isLedSelected = true;

  };


  // ##############################################################

  $scope.saveDelay = function() {

    console.log("SAVE DELAY: existing object = "+$scope.isEditing+", object id: "+ $scope.editId);

    if (typeof $scope.delay != 'number' || $scope.delay < 1 || $scope.delay > 600) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('No valid delay')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }


    if ($scope.isEditing) {

      for (var i = 0; i < $scope.sequence.operations__c.length; i++) {

        // just update parameter
        if ($scope.sequence.operations__c[i].id == $scope.editId) {
          $scope.sequence.operations__c[i].wait = $scope.delay;
        }
      }

    } else {

      $scope.sequence.operations__c.push(
        {
          'id': $scope.sequence.operations__c.length + 1,
          'drag': true,
          'type': 'delay',
          'wait': $scope.delay,
          'isProceeding': false
        }
      );
    }

    console.log($scope.sequence);

    $scope.isOverview = false;
    $scope.isAddPage = false;
    $scope.pages = {
      'addMovement' : false,
      'addAnimation' : false,
      'addLighting' : false,
      'addLevelLighting' : false,
      'addDelay' : false,
    };

    $scope.resetParameter();

    $scope.save();
  };

  $scope.editDelay = function(operation) {

    $scope.addDelay();

    $scope.bars.rows.forEach(function(row, j, b) {
      row.cols.forEach(function(item, k, c) {
        console.log(operation.bar+" == "+item.name+" -> "+(operation.bar == item.name))
        if (operation.bar == item.name) {

          item.wait = operation.wait;
          $scope.delay = operation.wait;

          $scope.refreshSlider();
        }
      });
    });
    $scope.isEditing = true;

  };

  // ##############################################################

  $scope.edit = function(item) {

    console.log("Edit:" + item.id);

    $scope.isEditing = true;
    $scope.editId = item.id;
    $scope.editObject = item;

    if (item.type == 'delay') {
      $scope.editDelay(item);

    } else if (item.type == 'operation') {

      if (item.function == 'move') {
        $scope.editMove(item);
      } else if (item.function == 'animate') {
        $scope.editAnimation(item);
      } else if (item.function == 'lighting') {
        $scope.editLighting(item);
      } else if (item.function == 'level lighting') {
        $scope.editLevelLighting(item);
      }
    }

  };

  $scope.save = function() {

    $scope.isLoading = true;
    $scope.isSaving = true;

    if (typeof $scope.sequence.title__c == 'undefined' || $scope.sequence.title__c == '') {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Missing sequence title!')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    var url = $scope.uriPraefix + '/sequences';
    var method = 'POST';
    if (typeof $scope.sequence.id != 'undefined' && $scope.sequence.id != '') {
      method = 'PUT';
      url = url+ '/' + $scope.sequence.id;
    }

    var data = {
      'title__c': $scope.sequence.title__c,
      'operations__c': ''
    };

    // angular.toJson($scope.sequence, false);
    // console.log(data);
    //data = data.replace('\n', '').replace('\t','');
    //data.operations__c.replace('\n', '').replace('\t','');

    data.operations__c = angular.toJson($scope.sequence.operations__c, false).replaceAll("\"", "'");
    console.log(data);

    data = angular.toJson(data, false);
    console.log(data);


    console.log(method+' '+ url);
    $http(
      {
        method: method ,
        url: url,
        data: data
      }).
        success(function(data, status) {
          console.log(data);

          $scope.isSaved = true;
          $scope.isLoading = false;

          $scope.isSaving = false;

          $mdToast.show(
            $mdToast.simple()
              .textContent('Saved')
              .position('top right')
              .hideDelay(3000)
          );

          $scope.sequences = [];
          $scope.getSquences();

        }).
        error(function(data, status) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Saving failed: [' +status+ '] ' +data)
              .position('top right')
              .hideDelay(3000)
          );
      });

  };

// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------

  $scope.functions = [];
  $scope.currentFunction = -1;
  $scope.isRunning = false;

  $scope.next = function() {

    $scope.currentFunction++;

    if ($scope.currentFunction < $scope.functions.length) {

      console.log("NEXT: "+$scope.functions[$scope.currentFunction]+" -> Current: "+ ($scope.currentFunction + 1) +"/"+$scope.functions.length);

      for (var i = 0; i < $scope.sequence.operations__c.length; i++) {
          $scope.sequence.operations__c[i].isProceeding = false;
      }
      $scope.sequence.operations__c[$scope.currentFunction].isProceeding = true;

      setTimeout($scope.functions[$scope.currentFunction], 500);

    } else {

      for (var i = 0; i <  $scope.sequence.operations__c.length; i++) {
          $scope.sequence.operations__c[i].isProceeding = false;
      }


      $mdToast.show(
        $mdToast.simple()
          .textContent('Execution complete!')
          .position('top right')
          .hideDelay(3000)
      );

      $scope.isRunning = false;

    }

  };



  var executeMove = function(next) {

    console.log("EXECUTE MOVE: id = "+($scope.sequence.operations__c[$scope.currentFunction].id));

    var uri = $scope.uriPraefix + '/move/'
       + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/' // :barReceiver
       + $scope.sequence.operations__c[$scope.currentFunction].position + '/' // :position
       + $scope.sequence.operations__c[$scope.currentFunction].speed; // :speed

    console.log('GET '+ uri);

    $http({ method: 'GET', url: 'http://localhost/api/v1/bars' }). //TODO
        success(function(data, status) {
          //console.log(data);
          console.log("--> Request done");
          next();
        });
  };

  var executeAnimation = function(next) {

    console.log("EXECUTE ANIMATION: id = "+($scope.sequence.operations__c[$scope.currentFunction].id));

    var uri = $scope.uriPraefix + '/animation/'
       + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/' // :barReceiver
       + $scope.sequence.operations__c[$scope.currentFunction].animation + '/'
       + $scope.sequence.operations__c[$scope.currentFunction].color + '/'
       + $scope.sequence.operations__c[$scope.currentFunction].brightness + '/'
       + $scope.sequence.operations__c[$scope.currentFunction].speed; // :speed

    console.log('GET '+ uri);

    $http({ method: 'GET', url: 'http://localhost/api/v1/bars' }). //TODO
        success(function(data, status) {
          //console.log(data);
          console.log("--> Request done");
          next();
        });
  };

  var executeLighting = function(next) {

    console.log("EXECUTE LIGHTING: id = "+($scope.sequence.operations__c[$scope.currentFunction].id));

    if ($scope.sequence.operations__c[$scope.currentFunction].op == 'New') {

      var uri = $scope.uriPraefix + '/bars/'
         + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/'
         + 'sides/'
         + $scope.sequence.operations__c[$scope.currentFunction].side.toLowerCase() + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].op.toLowerCase();

    } else if ($scope.sequence.operations__c[$scope.currentFunction].op == 'Add') {

      var uri = $scope.uriPraefix + '/bars/'
         + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/'
         + 'sides/'
         + $scope.sequence.operations__c[$scope.currentFunction].side.toLowerCase() + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].op.toLowerCase() + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].led + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].color;

    } else if ($scope.sequence.operations__c[$scope.currentFunction].op == 'Remove') {

      var uri = $scope.uriPraefix + '/bars/'
         + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/'
         + 'sides/'
         + $scope.sequence.operations__c[$scope.currentFunction].side.toLowerCase() + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].op.toLowerCase() + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].led;
    }

    console.log('GET '+ uri);

    $http({ method: 'GET', url: 'http://localhost/api/v1/bars' }). //TODO
        success(function(data, status) {
          //console.log(data);
          console.log("--> Request done");
          next();
        });
  };

  var executeLevelLighting = function(next) {

    console.log("EXECUTE LEVEL LIGHTING: id = "+($scope.sequence.operations__c[$scope.currentFunction].id));

    if ($scope.sequence.operations__c[$scope.currentFunction].op == 'Add') {

      var uri = $scope.uriPraefix + '/bars/'
         + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/'
         + 'level/'
         + $scope.sequence.operations__c[$scope.currentFunction].led + '/'
         + $scope.sequence.operations__c[$scope.currentFunction].color;

    } else if ($scope.sequence.operations__c[$scope.currentFunction].op == 'Remove') {
      var uri = $scope.uriPraefix + '/bars/'
         + $scope.sequence.operations__c[$scope.currentFunction].bar.toLowerCase() + '/'
         + 'level/'
         + $scope.sequence.operations__c[$scope.currentFunction].led + '/'
         + '000000';
    }

    console.log('GET '+ uri);

    $http({ method: 'GET', url: 'http://localhost/api/v1/bars' }). //TODO
        success(function(data, status) {
          //console.log(data);
          console.log("--> Request done");
          next();
        });
  };


  var executeDelay = function(next) {

    console.log("EXECUTE DELAY: id = "+($scope.sequence.operations__c[$scope.currentFunction].id));

    setTimeout(next, $scope.sequence.operations__c[$scope.currentFunction].wait * 1000);
  };



  $scope.run = function() {

    $scope.isRunning = true;

    if ($scope.sequences.length == 0) {

      $mdToast.show(
        $mdToast.simple()
          .textContent('You can´t run an empty sequence...')
          .position('top right')
          .hideDelay(3000)
      );
      return;
    }

    if ($scope.sequence.title == "") {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Missing sequence title!')
          .position('top right')
          .hideDelay(3000)
      );
      return;
    }

    $scope.functions = [];
    $scope.currentFunction = -1;

    $scope.sequence.operations__c.forEach(function(item,a,i) {
      if (item.type == 'delay') {
        $scope.functions.push(function() { executeDelay($scope.next) } ); // Add delay

      } else if (item.type == 'operation') {

        if (item.function == 'move') {
          $scope.functions.push(function() { executeMove($scope.next) } ); // Add execution
        } else if (item.function == 'animate') {
          $scope.functions.push(function() { executeAnimation($scope.next) } ); // Add execution
        } else if (item.function == 'lighting') {

        } else if (item.function == 'level lighting') {

        }
      }
    });



    // Execute function sequence
    $scope.next();

  };


// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------

  $scope.deleteSequence = function(sequence) {

    $scope.isLoading = true;

    var url = $scope.uriPraefix + '/sequences';
    var method = 'DELETE';
    if (typeof sequence.id != 'undefined' && sequence.id != '') {
      url = url+ '/' + sequence.id;
    } else {

      $mdToast.show(
        $mdToast.simple()
          .textContent('Missing sequence id!')
          .position('top right')
          .hideDelay(3000)
      );

      return;
    }

    console.log(method+' '+ url);
    $http(
      {
        method: method ,
        url: url
      }).
        success(function(data, status) {
          console.log(data);

          $scope.isLoading = false;

          $mdToast.show(
            $mdToast.simple()
              .textContent('Sequence deleted')
              .position('top right')
              .hideDelay(3000)
          );

          $scope.isLoading = false;

          $scope.sequences = [];
          $scope.sequence = {};
          $scope.getSquences();

        }).
        error(function(data, status) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Deletion failed: [' +status+ '] ' +data)
              .position('top right')
              .hideDelay(3000)
          );
      });

  };




 // Model to JSON for demo purpose
 $scope.$watch('sequence', function(model) {
     $scope.modelAsJson = angular.toJson(model, true);
 }, true);




});
