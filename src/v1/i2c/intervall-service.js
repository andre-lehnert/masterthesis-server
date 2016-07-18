// ---------------- Operation --------------------------------------------------

// Database Access (salesforce REST-API)
var db = require('./../database/salesforce/database'),
    i2c = require('./../i2c/i2c-controller');

var tick = 0;


var _handler;

// ---------------- Operations -------------------------------------------------

var checkToken = function(_bars, pointer) {

  // Round-Robin Check
  console.log('TICK >>> '+tick+' >>> POINTER >>> '+pointer);
  tick >= 32000 ? tick = 0 : tick++;

//  console.log('STATUS CHECK: ' + _bars[pointer].motor__c);

  i2c.status(_bars[pointer]);
};

/*
 * Database Request to get all available bars
 */
var getAvailableBars = function(device, callback) {
  db.getBarsByDevice(device, callback);
};


// ---------------- Interface --------------------------------------------------

module.exports = {

  start : function(device, interval) {

    console.log('I2C Request Handler started');
    console.log('Interval: '+ interval);
    var req = {}, res = {}, next = function() {};
    _handler = setInterval(
        function() {
          // Handle functions
            getAvailableBars(device, function(_bars) { // database entries

              var req = {}, res = {};
              req.response = {};

              i2c.getBars(req, res, function(req,res, next) { // physically connected

                var availableBars = [];

                req.availableBars.forEach(function(bar, index, array) {
                  _bars.forEach(function(_bar, _index, _array) {
                    if (_bar.motor__c == bar.motor) {
                      availableBars.push(_bar);
                    }
                  });
                });

                checkToken(availableBars, (tick % availableBars.length) );
              });

           });
        },
        interval);

  },

  stop : function() {
    setTimeout(
      function() {
        clearInterval(_handler);
        console.log('I2C Request Handler stoped');
      },
      0);
  }
};
