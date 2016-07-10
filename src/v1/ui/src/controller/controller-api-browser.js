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

    $scope.apiVersion = '0';
    $scope.uriPraefix = 'api/v';
    $scope.details;

    $scope.findVersion =  $scope.apiVersion;

    // tabs
    $scope.tabs = [
          { name: 'Operations', title: 'Operations' },
          { name: 'Details', title: 'Details' },
          { name: 'Examples', title: 'Example API Invokations' },
          { name: 'Results', title: 'Results' },
        ];
    var selected = null,
        previous = null;
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function(current, old){
      previous = selected;
      selected = $scope.tabs[current];
      if ( current + 1 ) $log.debug('New Tab: ' + selected.name);
    });

    // general information
    $http({method: 'GET' , url: $scope.uriPraefix +  $scope.apiVersion}).
        success(function(data, status) {
          console.log(data);
          $scope.title = data.description;
          $scope.apiVersion = data.version;
          $scope.operations = data.api;
        }).
        error(function(data, status) {
          console.log(data || "Request failed");
      });


      // 0. search api version
      $scope.searchAPI = function() {

           $http({method: 'GET' , url: $scope.uriPraefix +  $scope.findVersion}).
              success(function(data, status) {
                console.log(data);
                $scope.title = data.description;
                $scope.apiVersion = data.version;
                $scope.author = data.author;
                $scope.operations = data.api;
              }).
              error(function(data, status) {
                console.log(data || "Request failed");
                $scope.findVersion = '';
                $scope.apiVersion = 'not found';
                $scope.operations = '';
                $scope.details = [];
            });

            $scope.selectedIndex = 0; // first tab

      };



      // 1. operations > details
      $scope.setDetail = function(uri) {


          $http({method: 'GET' , url: $scope.uriPraefix + $scope.apiVersion + uri}).
              success(function(data, status) {
                console.log(data);
                $scope.details = data.urls;
              }).
              error(function(data, status) {
                console.log(data || "Request failed");
                $scope.details = [];
            });

            $scope.selectedIndex++; // next tab

      };

      // 2. details > examples
      $scope.setExample = function(example) {

        $scope.examples = [];

        var url = example.url;
        var tempUrl = url;
        var temp = '';
        $log.debug('Example URI: ' + example);
        console.log(example);
        // iterate params



        for (var i = 0; i < example.params.length; i++) {

          // iterate example values
          for (var j = 0; j < example.params[i].values.length; j++) {
              // replace parameter placeholder with example values

              temp = tempUrl.replace(example.params[i].param, example.params[i].values[j]);

              if (temp.indexOf(':') == -1) {
                $scope.examples.push('/' + $scope.uriPraefix + $scope.apiVersion + temp);              
              } else {
                tempUrl = temp;

              }
          }
        }

        $scope.selectedIndex++; // next tab
      };

      // 3. examples > results
      $scope.invokeExample = function(uri) {

        $http({method: 'GET' , url: uri}).
            success(function(data, status) {
              console.log(data);
              $scope.response = data;
            }).
            error(function(data, status) {
              console.log(data || "Request failed");
          });

          $scope.selectedIndex++; // next tab
    };



});
