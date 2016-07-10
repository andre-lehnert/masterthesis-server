'use strict';
angular
.module( 'app.controller.apibrowser', [
                                  'ngMaterial',
                                  'ngMessages'
                                ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// Help
.controller('ApiBrowserController', function($scope, $log, $http, $rootScope) {

    $rootScope.currentPage = $rootScope.mainPages[3];

    $log.debug("ApiBrowserController");

    $scope.apiVersion = '1';
    $scope.uriPraefix = 'api/v';
    $scope.details;

    // tabs
    $scope.tabs = [
          { name: 'Operations', title: 'Operations' },
          { name: 'Details', title: 'Details' },
          { name: 'Results', title: 'Results' },
        ];

    var selected = null,
        previous = null;
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function(current, old){
      previous = selected;
      selected = $scope.tabs[current];
      if ( current + 1) $log.debug('New Tab: ' + selected.name);
    });

    // general information
    $http({method: 'GET' , url: $scope.uriPraefix +  $scope.apiVersion}).
        success(function(data, status) {
          $scope.title = 'API '+data.name;
          $scope.operations = data.operations;
        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });


      // 0. search api version
      $scope.searchAPI = function() {
           $http({method: 'GET' , url: $scope.uriPraefix +  $scope.apiVersion}).
              success(function(data, status) {
                $scope.title = data.description;
                $scope.operations = data.operations;
              }).
              error(function(data, status) {
                console.log(data || "Request failed");
                $scope.apiVersion = '';
                $scope.operations = '';
                $scope.details = [];
            });

            $scope.selectedIndex = 0; // first tab

      };

      $scope.details = [];

      // 1. operations > details
      $scope.setDetail = function(uri) {

        $scope.details = [];

          $http({method: 'GET' , url: uri}).
              success(function(data, status) {
                //console.log(data);

                data.objects.forEach(function(element, index, arr) {

                  if (typeof element.label__c != 'undefined' && data.href.indexOf("sides") < 0) {
                    //console.log(element.label__c);
                    $scope.details.push(uri + '/' + element.label__c);
                  } else if (typeof element.id != 'undefined') {
                    //console.log(element.id);
                    $scope.details.push(uri + '/' + element.id);
                  }
                });
              }).
              error(function(data, status) {
                console.log(data || "Request failed");
                $scope.details = [];
            });

            $scope.selectedIndex++; // next tab

      };

      $scope.response = "";

      // 3. examples > results
      $scope.invokeExample = function(uri) {
        $scope.response = "";

        $http({method: 'GET' , url: uri}).
            success(function(data, status) {

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

              $scope.response = data;
            }).
            error(function(data, status) {
              console.log(data || "Request failed");
          });

          $scope.selectedIndex++; // next tab
    };



});
