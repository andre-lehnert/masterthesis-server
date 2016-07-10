'use strict';
angular
.module( 'app.controller.devices', [
                                      'ngMaterial',
                                      'ngMessages'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// #1 Devices
.controller('DevicesController', function($scope, $log) {

    $scope.currentPage = 'Devices';
    $log.debug("DevicesController");



});
