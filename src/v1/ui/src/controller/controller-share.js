'use strict';
angular
.module( 'app.controller.share', [
                                  'ngMaterial',
                                  'ngMessages'
                                ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// Share
.controller('ShareController', function($scope, $log) {

    $scope.currentPage = 'Share';
    $log.debug("ShareController");
});
