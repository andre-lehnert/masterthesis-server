'use strict';
angular
.module( 'app.controller.settings', [
                                  'ngMaterial',
                                  'ngMessages'
                                ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// Settings
.controller('SettingsController', function($scope, $log) {

      $scope.currentPage = 'Settings';
      $log.debug("SettingsController");
  });
