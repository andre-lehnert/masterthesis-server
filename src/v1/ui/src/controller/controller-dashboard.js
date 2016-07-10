'use strict';
angular
.module( 'app.controller.dashboard', [
                                      'ngMaterial',
                                      'ngMessages'//,
                                      //'chart.js'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// #1 Dashboard
.controller('DashboardController', function($scope, $log, $rootScope) {

    $rootScope.currentPage = $rootScope.mainPages[1];
    $log.debug("DashboardController");
});
