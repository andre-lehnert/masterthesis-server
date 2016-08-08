'use strict';
angular
.module( 'app.controller.timeline', [
                                      'ngMaterial',
                                      'ngMessages',
                                      'chart.js',
                                      'infinite-scroll',
                                      'ngCookies'
                                    ] )

// constants
.constant('MODULE_VERSION', '0.0.1')

// Optional configuration
.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  // ChartJsProvider.setOptions({
  //   // chartColors: ['#FF5252', '#FF8A80'],
  //   responsive: true,
  //   animation: false
  // });

  // //Configure all line charts
  // ChartJsProvider.setOptions('line', {
  //   'showTooltips': false,
  // });


}])

// // // // // // // // // // // // // // // // // // // // // // // // //
// #0 Timeline
.controller('TimelineController', function($scope, $log, $rootScope, $timeout, $http, $cookieStore, $mdToast) {

  $scope.uriPraefix = '/api/v1';
  $scope.uriNotifications = $scope.uriPraefix + '/notifications';
  $scope.uriInvocations = $scope.uriPraefix + '/invocations';
  $scope.uriActivations = $scope.uriPraefix + '/activations';

  $scope.isLoading= false;
  $scope.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $scope.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Check connected smartphone
  // Get smartphone specific notifications
  $scope.smartphone = $cookieStore.get('hci-smartphone-id');;
  if (typeof $scope.smartphone != 'undefined') {
    $scope.uriNotifications = $scope.uriPraefix + '/smartphones/'+ $scope.smartphone +'/notifications';
    $scope.uriInvocations = $scope.uriPraefix + '/smartphones/'+ $scope.smartphone +'/invocations';
    $scope.uriActivations = $scope.uriPraefix + '/smartphones/'+ $scope.smartphone +'/activations';
  }

  $scope.thisWeek = [];
  $scope.weeks = [];

  // Init with this week

  $scope.loadThisWeek = function() {

    $scope.isLoading= true;

    // Get date YYYY-MM-DD
    var today = new Date();

    var currentThursday = new Date(today.getTime() +(3-((today.getDay()+6) % 7)) * 86400000);
    // At the beginnig or end of a year the thursday could be in another year.
    var yearOfThursday = currentThursday.getFullYear();
    // Get first Thursday of the year
    var firstThursday = new Date(new Date(yearOfThursday,0,4).getTime() +(3-((new Date(yearOfThursday,0,4).getDay()+6) % 7)) * 86400000);
    // +1	we start with week number 1
    // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000/7);
    var week = weekNumber + 1;
    var firstDay = new Date(today.getFullYear(), 0, 1).getDay();
    var year = today.getFullYear();
    var d = new Date("Jan 01, "+year+" 01:00:00");
    var w = d.getTime() - (3600000*24*(firstDay-1)) + 604800000 * (week-1);
    var n1 = new Date(w);
    var n2 = new Date(w + 518400000);

    // malformd query if 2016-7-5
    var n1m = (n1.getMonth()+1) < 10 ? '0' + (n1.getMonth()+1) : (n1.getMonth()+1);
    var n1d = (n1.getDate()) < 10 ? '0' + (n1.getDate()) : (n1.getDate());

    var startDate = n1.getFullYear()+'-' + n1m + '-'+n1d;

    getCurrentWeekInfos(today, n1, getCurrentWeekInfos);
  };

  var getCurrentWeekInfos = function (currentDay, firstDay, callback) {

    if (currentDay > firstDay) {

      var n1m = (currentDay.getMonth()+1) < 10 ? '0' + (currentDay.getMonth()+1) : (currentDay.getMonth()+1);
      var n1d = (currentDay.getDate()) < 10 ? '0' + (currentDay.getDate()) : (currentDay.getDate());

      var startDate = currentDay.getFullYear()+'-' + n1m + '-'+n1d;

      var url = $scope.uriNotifications + '?date='+ startDate;
      console.log('GET '+ url);
      $http({method: 'GET', url: url})
        .success(function(data, status) {

          var tDateD = currentDay.getDate() < 10 ? '0' + currentDay.getDate() : currentDay.getDate();
          var tDateFormat = tDateD +'. '+ $scope.monthNames[currentDay.getMonth()];

          var tw = {
            'date': tDateFormat,
            'praefix': '',
            'notifications': {
              'sum': 0,
              'hours': [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
            },

            'invocations': {
              'sum': 0,
              'hours': [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
              'usageHours': 0,
              'usageMinutes': 0
            },

            'activations': {
              'sum': 0,
              'hours': [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
              'usageHours': 0,
              'usageMinutes': 0
            }
          };

          // Praefix
          if (currentDay.getDate() == new Date().getDate())
            tw.praefix = 'Today, ';
          if (currentDay.getDate() == new Date().getDate() - 1)
            tw.praefix = 'Yesterday, ';

          for (var j = 0; j < data.objects.length; j++) {

            var tDate = new Date(Date.parse(data.objects[j].datetime__c));
            var tDateH = tDate.getHours();

            tw.notifications.hours[0][tDateH - 1]++;
            tw.notifications.sum++;
          }


          var url = $scope.uriInvocations + '?date='+ startDate;
          console.log('GET '+ url);
          $http({method: 'GET', url: url})
            .success(function(data, status) {
              console.log(data);
              for (var j = 0; j < data.objects.length; j++) {

                var tDate = new Date(Date.parse(data.objects[j].start__c));
                var tDateH = tDate.getHours();

                var tEnd = new Date(Date.parse(data.objects[j].end__c));
                var diff = tEnd.getTime() - tDate.getTime() - 3600000; // this is a time in milliseconds
                var diff_as_date = new Date(diff);

                tw.invocations.hours[0][tDateH - 1]++;
                tw.invocations.sum++;

                tw.invocations.usageHours = tw.invocations.usageHours + diff_as_date.getHours(); // hours
                tw.invocations.usageMinutes = tw.invocations.usageMinutes + diff_as_date.getMinutes();
              }


              var url = $scope.uriActivations + '?date='+ startDate;
              console.log('GET '+ url);
              $http({method: 'GET', url: url})
                .success(function(data, status) {

                  for (var j = 0; j < data.objects.length; j++) {

                    var tDate = new Date(Date.parse(data.objects[j].start__c));
                    var tDateH = tDate.getHours();
                    var tEnd = new Date(Date.parse(data.objects[j].end__c));
                    var diff = tEnd.getTime() - tDate.getTime() - 3600000; // this is a time in milliseconds
                    var diff_as_date = new Date(diff);

                    tw.activations.hours[0][tDateH - 1]++;
                    tw.activations.sum++;

                    tw.activations.usageHours = tw.activations.usageHours + diff_as_date.getHours(); // hours
                    tw.activations.usageMinutes = tw.activations.usageMinutes + diff_as_date.getMinutes();
                  }


                  $scope.thisWeek.push(tw);

                  currentDay.setDate(currentDay.getDate() - 1);
                  callback(currentDay, firstDay, getCurrentWeekInfos);
                })
                .error(function(data, err) {
                  $mdToast.show(
                    $mdToast.simple()
                      .textContent('Request failure: '+url)
                      .position('bottom left')
                      .hideDelay(10000)
                  );
                });
            })
            .error(function(data, err) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Request failure: '+url)
                  .position('bottom left')
                  .hideDelay(10000)
              );
            });;
        })
        .error(function(data, err) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Request failure: '+url)
              .position('bottom left')
              .hideDelay(10000)
          );
        });;

    } else {
      $scope.isLoading= false;
    }
  };


  $scope.loadThisWeek();


  $scope.loadMore = function() {

    $scope.isLoading= true;

    if (typeof $scope.weekPointer == 'undefined') {
      $scope.weekPointer = 0;
    } else {
      $scope.weekPointer++;
    }

    var today = new Date();

    var currentThursday = new Date(today.getTime() +(3-((today.getDay()+6) % 7)) * 86400000);
    // At the beginnig or end of a year the thursday could be in another year.
    var yearOfThursday = currentThursday.getFullYear();
    // Get first Thursday of the year
    var firstThursday = new Date(new Date(yearOfThursday,0,4).getTime() +(3-((new Date(yearOfThursday,0,4).getDay()+6) % 7)) * 86400000);
    // +1	we start with week number 1
    // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000/7);
    var week = weekNumber - $scope.weekPointer;
    var firstDay = new Date(today.getFullYear(), 0, 1).getDay();
    var year = today.getFullYear();
    var d = new Date("Jan 01, "+year+" 01:00:00");
    var w = d.getTime() - (3600000*24*(firstDay-1)) + 604800000 * (week-1);
    var n1 = new Date(w);
    var n2 = new Date(w + 518400000);

    // malformd query if 2016-7-5
    var n1m = (n1.getMonth()+1) < 10 ? '0' + (n1.getMonth()+1) : (n1.getMonth()+1);
    var n2m =  (n2.getMonth()+1) < 10 ? '0' + (n2.getMonth()+1) : (n2.getMonth()+1);
    var n1d = (n1.getDate()) < 10 ? '0' + (n1.getDate()) : (n1.getDate());
    var n2d =  (n2.getDate()) < 10 ? '0' + (n2.getDate()) : (n2.getDate());

    var startDate = n1.getFullYear()+'-' + n1m + '-'+n1d;
    var endDate = n2.getFullYear()+'-' + n2m + '-'+n2d;

    var startFormat = (n1.getDate()) +'. '+ $scope.monthNames[n1.getMonth()];
    var endFormat = (n2.getDate()) +'. '+ $scope.monthNames[n2.getMonth()];

    var url = $scope.uriNotifications + '?start='+ startDate +'&end='+ endDate;
    console.log('GET '+ url);
    $http({method: 'GET', url: url})
      .success(function(data, status) {

        var w = {
          'start': startFormat,
          'end': endFormat,
          'week': week,
          'days': [],
          'notifications': {
            'sum': 0,
            'days': [[0,0,0,0,0,0,0]]
          },

          'invocations': {
            'sum': 0,
            'days': [[0,0,0,0,0,0,0]],
            'usageHours': 0,
            'usageMinutes': 0
          },

          'activations': {
            'sum': 0,
            'days': [[0,0,0,0,0,0,0]],
            'usageHours': 0,
            'usageMinutes': 0
          }

        };

        var days = [
          n1.getDate() + 6,
          n1.getDate() + 5,
          n1.getDate() + 4,
          n1.getDate() + 3,
          n1.getDate() + 2,
          n1.getDate() + 1,
          n1.getDate() + 0,
        ];

        for (var j = 0; j < 7; j++) {
          var tDateD = days[j] < 10 ? '0' + days[j] : days[j];
          var tDateFormat = tDateD +'. '+ $scope.monthNames[n1.getMonth()];

          w.days.push({
            'date': tDateFormat,
            'notifications': {
              'sum': 0,
              'hours': [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
            },

            'invocations': {
              'sum': 0,
              'hours': [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
              'usageHours': 0,
              'usageMinutes': 0
            },

            'activations': {
              'sum': 0,
              'hours': [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
              'usageHours': 0,
              'usageMinutes': 0
            }
          });
        }



        //console.log(data);

        w.notifications.sum = data._count;

        for (var i = 0; i < data.objects.length; i++) {

          //console.log(data.objects[i]);
          var tDate = new Date(Date.parse(data.objects[i].datetime__c));
          var tDay = tDate.getDate();

          for (var j = 0; j < 7; j++) {
            if (tDay == days[j]) {

              w.notifications.days[0][j]++; // week day summary

              // day
              var tDateH = tDate.getHours();

              w.days[j].notifications.hours[0][tDateH - 1]++;
              w.days[j].notifications.sum++;
            }
          }
        }

        var url = $scope.uriInvocations + '?start='+ startDate +'&end='+ endDate;
        console.log('GET '+ url);
        $http({method: 'GET', url: url})
          .success(function(data, status) {

            //console.log(data);

            w.invocations.sum = data._count;

            for (var i = 0; i < data.objects.length; i++) {

              //console.log(data.objects[i]);
              var tDate = new Date(Date.parse(data.objects[i].start__c));
              var tDay = tDate.getDate();

              for (var j = 0; j < 7; j++) {
                if (tDay == days[j]) {

                  w.invocations.days[0][j]++; // week day summary

                  // day
                  var tDateH = tDate.getHours();
                  var tEnd = new Date(Date.parse(data.objects[i].end__c));
                  var diff = tEnd.getTime() - tDate.getTime() - 3600000; // this is a time in milliseconds
                  var diff_as_date = new Date(diff);

                  w.days[j].invocations.usageHours = w.days[j].invocations.usageHours + diff_as_date.getHours(); // hours
                  w.days[j].invocations.usageMinutes = w.days[j].invocations.usageMinutes + diff_as_date.getMinutes();

                  w.days[j].invocations.hours[0][tDateH - 1]++;
                  w.days[j].invocations.sum++;
                }
              }
            }

            var url = $scope.uriActivations + '?start='+ startDate +'&end='+ endDate;
            console.log('GET '+ url);
            $http({method: 'GET', url: url})
              .success(function(data, status) {

                //console.log(data);

                w.activations.sum = data._count;

                for (var i = 0; i < data.objects.length; i++) {

                  var tDate = new Date(Date.parse(data.objects[i].start__c));
                  var tDay = tDate.getDate();

                  for (var j = 0; j < 7; j++) {
                    if (tDay == days[j]) {

                      w.activations.days[0][j]++; // week day summary

                      // day
                      var tDateH = tDate.getHours();
                      var tEnd = new Date(Date.parse(data.objects[i].end__c));
                      var diff = tEnd.getTime() - tDate.getTime() - 3600000; // this is a time in milliseconds
                      var diff_as_date = new Date(diff);

                      w.days[j].activations.usageHours = w.days[j].activations.usageHours + diff_as_date.getHours(); // hours
                      w.days[j].activations.usageMinutes = w.days[j].activations.usageMinutes + diff_as_date.getMinutes();

                      w.days[j].activations.hours[0][tDateH - 1]++;
                      w.days[j].activations.sum++;
                    }
                  }
                }


                for (var j = 0; j < 7; j++) {
                  w.activations.usageHours = w.activations.usageHours + w.days[j].activations.usageHours;
                  w.invocations.usageHours = w.invocations.usageHours + w.days[j].invocations.usageHours;

                  w.activations.usageMinutes = w.activations.usageMinutes + w.days[j].activations.usageMinutes;
                  w.invocations.usageMinutes = w.invocations.usageMinutes + w.days[j].invocations.usageMinutes;
                }

                while(w.activations.usageMinutes > 60) {
                  w.activations.usageMinutes = w.activations.usageMinutes - 60;
                  w.activations.usageHours++;
                }

                while(w.invocations.usageMinutes > 60) {
                  w.invocations.usageMinutes = w.invocations.usageMinutes - 60;
                  w.invocations.usageHours++;
                }

                $scope.weeks.push(w);

                $scope.isLoading= false;
              })
              .error(function(data, err) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('Request failure: '+url)
                    .position('bottom left')
                    .hideDelay(10000)
                );
              });;
          })
          .error(function(data, err) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Request failure: '+url)
                .position('bottom left')
                .hideDelay(10000)
            );
          });;

      })
      .error(function(data, err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Request failure: '+url)
            .position('bottom left')
            .hideDelay(10000)
        );
      });;


  };



//  $scope.loadMore();


    $rootScope.currentPage = $rootScope.mainPages[0];
    $log.debug("TimelineController");

    $scope.labels = [
      ' ','  ','3:00',
      '   ','    ','6:00',
      '       ', '        ','9:00',
      '          ','           ','12:00',
      '             ','              ','15:00',
      '               ','                ','18:00',
      '                 ','                  ','21:00',
      '                    ','                     ','24:00'];
    $scope.series = ['a'];

    $scope.data = [
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
    ];

    $scope.weekData = [
      [1,2,3,4,5,6,7]
    ];

    $scope.weekLabels = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    $scope.chartOptions = {
        'scales': {
            'xAxes': [
              {
                'gridLines' : { 'display' : false },

              },
            ],
            'yAxes': [
              { 'gridLines' : { 'display' : false } }
            ]
        },
        'legend': { 'display': false },
        'tooltips': {
          'enabled': false
        }
    };
});
