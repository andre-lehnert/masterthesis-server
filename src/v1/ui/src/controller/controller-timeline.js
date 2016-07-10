'use strict';
angular
.module( 'app.controller.timeline', [
                                      'ngMaterial',
                                      'ngMessages'//,
                                      //'chart.js'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// #0 Timeline
.controller('TimelineController', function($scope, $log, $rootScope, $timeout) {

    $rootScope.currentPage = $rootScope.mainPages[0];
    $log.debug("TimelineController");

    // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    // $scope.series = ['Series A', 'Series B'];
    //
    // $scope.data = [
    //   [65, 59, 80, 81, 56, 55, 40],
    //   [28, 48, 40, 19, 86, 27, 90]
    // ];
});
