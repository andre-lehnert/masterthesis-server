'use strict';

var app = angular.module('TaNo',
[
    'ngMaterial',
    'ngMessages',

    // application modules
    'app.controller.navigation',

    // Main Pages
    'app.controller.timeline', // show event timeline
    'app.controller.editor', // customize animation and translation sequences
    'app.controller.manualcontrol', // control shape-changing display manually
    //'app.controller.dashboard', // current stats
    'app.controller.apibrowser', // API Browser shows different API versions

    // Sub Pages
    'app.controller.devices',
    //'app.controller.settings',
    //'app.controller.help',
    //'app.controller.share',

    // Utils

]);

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {

        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
