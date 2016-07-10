'use strict';
angular
.module( 'app.controller.help', [
                                  'ngMaterial',
                                  'ngMessages'
                                ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// Help
.controller('HelpController', function($scope, $log) {

    $scope.currentPage = 'Help';
    $log.debug("HelpController");
});
