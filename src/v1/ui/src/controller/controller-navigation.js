'use strict';
angular
.module( 'app.controller.navigation', [
                                      'ngMaterial',
                                      'ngMessages',
                                      'ngRoute'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.1')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../templates/timeline.html',
        controller: 'TimelineController'
      })
      .when('/timeline', {
        templateUrl: '../templates/timeline.html',
        controller: 'TimelineController'
      })
      .when('/dashboard', {
        templateUrl: '../templates/dashboard.html',
        controller: 'DashboardController'
      })
      .when('/control', {
        templateUrl: '../templates/control.html',
        controller: 'ControlController'
      })
      .when('/api', {
        templateUrl: '../templates/api.html',
        controller: 'ApiBrowserController'
      })
      .when('/devices', {
        templateUrl: '../templates/devices.html',
        controller: 'DevicesController'
      })
      .when('/settings', {
        templateUrl: '../templates/settings.html',
        controller: 'SettingsController'
      })
      .when('/help', {
        templateUrl: '../templates/help.html',
        controller: 'HelpController'
      })
      .when('/share', {
        templateUrl: '../templates/share.html',
        controller: 'ShareController'
      })
      .otherwise({ redirectTo: '/' });
  }])



// // // // // // // // // // // // // // // // // // // // // // // // //
.controller('MenuController', function ($scope, $timeout, $mdSidenav, $log, $location, $rootScope) {


   $rootScope.mainPages = [
     {
       icon : 'schedule',
       text: 'Timeline',
       path: '#/timeline'
     },
     {
       icon : 'dashboard',
       text: 'Dashboard',
       path: '#/dashboard'
     },
     {
       icon : 'pan_tool',
       text: 'Control',
       path: '#/control'
     },
     {
       icon : 'chrome_reader_mode',
       text: 'API',
       path: '#/api'
     },
   ];

   $rootScope.subPages = [
     {
       icon : 'devices_other',
       text: 'My devices',
       path: '#/devices'
     },
     {
       icon : 'help',
       text: 'Help',
       path: '#/help'
     },
     {
       icon : 'share',
       text: 'Share',
       path: '#/share'
     },
     {
       icon : 'settings',
       text: 'Settings',
       path: '#/settings'
     },
   ];

    $rootScope.currentPage = $scope.mainPages[0];


    $scope.navigateTo =   function navigateTo(page) {

       $scope.currentPage = page;
       $log.debug("Page: " + page.path + " selected");

      //  $location.url('templates/timeline.html'); // path not hash

      // close sidenav after interaction
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };

  $scope.toggleLeft = buildDelayedToggler('left');

  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };

  function debounce(func, wait, context) {
    var timer;

    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }

  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }
})

// SideNav Controller
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });

  };
});
