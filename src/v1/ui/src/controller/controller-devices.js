'use strict';
angular
.module( 'app.controller.devices', [
                                      'ngMaterial',
                                      'ngMessages',
                                      'ngCookies'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.1')


// // // // // // // // // // // // // // // // // // // // // // // // //
// #1 Devices
.controller('DevicesController', function($rootScope, $scope, $http, $log, $cookieStore, $mdDialog, $mdMedia) {

  $rootScope.currentPage = $rootScope.subPages[0];
  $log.debug("DevicesController");

  $scope.isLoading = false;
  $scope.uriPraefix = '/api/v1';
  $scope.smartphones = [];

  $scope.getSmartphones = function() {

    $scope.isLoading = true;

    var url = $scope.uriPraefix + '/smartphones';
    console.log('GET '+ url);
    $http({method: 'GET', url: url})
      .success(function(data, status) {

        $scope.primarySmartphone = $cookieStore.get('hci-smartphone-id');
        //console.log("COOKIE: "+$scope.primarySmartphone);

        data.objects.forEach(function(item, array, position) {

          $scope.smartphones.push({
            'model': item.model__c,
            'id': item.id,
            'primary': ($scope.primarySmartphone == item.id)
          });

        });



      	if (typeof $scope.primarySmartphone != 'undefined') {
      		  $scope.setPrimarySmartphone($scope.primarySmartphone);
      	}

        $scope.isLoading = false;
      });

  };

  $scope.setPrimarySmartphone = function(smartphoneId) {

    $cookieStore.put('hci-smartphone-id', smartphoneId);

    for(var i = 0; i < $scope.smartphones.length; i++) {
      //console.log($scope.smartphones[i].id+" == "+smartphoneId + " --> "+ ($scope.smartphones[i].id == smartphoneId));
      $scope.smartphones[i].primary = ($scope.smartphones[i].id == smartphoneId);
    }



  };



  $scope.deleteSmartphone = function(smartphone) {
    var confirm = $mdDialog.confirm()
      .title('Would you like to delete '+smartphone.model+'?')
      .textContent('You are going to delete all associated Apps, Contacts, Notifications, Invocations and Activations!')
      //.placeholder('Samsung Galaxy S6')
      .ariaLabel('Smartphone delete')
      .clickOutsideToClose(true)
      //.targetEvent(ev)
      .ok('DELETE')
      .cancel('Cancel');
    $mdDialog.show(confirm)
      .then(function(result) {


        var url = $scope.uriPraefix + '/smartphones/' + smartphone.id;
        console.log('DELETE '+ url);
        $http({ method: 'DELETE', url: url })
          .success(function(data, status) {
            console.log(data);

            $scope.smartphones = [];
            $scope.getSmartphones();

          })
          .error(function(err) {
            console.log("EOORORRRR");
          });

        $scope.status = result;
      }, function() {
        $scope.status = 'UNDEFINED';
      });
  };



  // Get Cookie
  $scope.getSmartphones();

  $scope.primarySmartphone = $cookieStore.get('hci-smartphone-id');
  console.log("COOKIE: "+$scope.primarySmartphone);

	if (typeof $scope.primarySmartphone != 'undefined') {
		  $scope.setPrimarySmartphone($scope.primarySmartphone);
	}



  $scope.addSmartphone = function() {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
      .title('Add Smartphone')
      //.textContent('Define a smartphone model:')
      .placeholder('Samsung Galaxy S6')
      .ariaLabel('Smartphone')
      .clickOutsideToClose(true)
      //.targetEvent(ev)
      .ok('Save')
      .cancel('Cancel');
    $mdDialog.show(confirm)
      .then(function(result) {


        var url = $scope.uriPraefix + '/smartphones';
        console.log('POST '+ url);
        $http(
          {
            method: 'POST',
            url: url,
            data:
            { "model__c": result }
          })
          .success(function(data, status) {
            console.log(data);

            $scope.smartphones.push({
              'model': data.records[0].model__c,
              'id': data.records[0].id,
              'primary': true
            });

            $scope.setPrimarySmartphone(data.records[0].id);


          })
          .error(function(err) {
            console.log("EOORORRRR");
          });

        $scope.status = result;
      }, function() {
        $scope.status = 'UNDEFINED';
      });
  };

});
