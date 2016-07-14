var i2c = require('i2c');
var MASTER = 0x0f;
var wire  = new i2c(MASTER, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface
var api = require('./api-model');

module.exports = {

  scan : function(target, command, callback, req, res, next) {

    wire.scan(function(err, data) {
      // result contains an array of addresses
      if (!err) {
        console.log('I2C RECEIVERS: '+data);

        if (typeof command != 'undefined' && typeof target != 'undefined') {
          if (command != 'SCAN') {
            callback(data, target, command, req, res, next);
          }
        } else { console.log('ERROR: command or taget missing'); }
      } else {
        console.log('ERROR: '+err);
      }
    });

  },

  send : function(address, message, req, res, next) {

      console.log("SEND COMMAND ["+address+"]: "+message);
      req.done = true;

      wire.setAddress(address);
      var bytes = [];

      for (var i = 0; i < message.length; ++i) {
        bytes.push(message.charCodeAt(i));
      }

      wire.writeBytes(0, bytes, function(err) {

        if (err != null) {
          console.log("ERROR: "+err)
          next();
        } else {

          if (req.update === 'position') {

console.log('I2C:send: >> Update Position: '+req.position);

            // New Position
            req.body =
              {
                "position__c": req.position
              };

          } else if (req.update === 'light') {

console.log('I2C:send: >> Update Lighting Pattern');

            req.body =
              {
                "led_0__c": req.leds[0],
                "led_1__c": req.leds[1],
                "led_2__c": req.leds[2],
                "led_3__c": req.leds[3],
                "led_4__c": req.leds[4],
                "led_5__c": req.leds[5],
                "led_6__c": req.leds[6],
                "led_7__c": req.leds[7],
                "led_8__c": req.leds[8],
                "led_9__c": req.leds[9],
                "led_10__c": req.leds[10],
                "label__c": req.side
              };
          } else if (req.update === 'animation') {

console.log('I2C:send: >> Update Animation: '+req.animation);

            req.body =
              {
              "animation__c": req.id,
              "color__c": req.color,
              "brightness__c": req.brightness,
              "animation_speed__c": req.speed
              };
          }

          req.success = true;
          next();
        }
      });
  },

  request : function(address, req, res, next) {

      //console.log("REQUEST ["+address+"]");
      req.done = true;

      wire.setAddress(address);

      wire.readByte(function(err, result) {
        if (err != null) {
          console.log("ERROR: "+err);
        } else {
          console.log("RECEIVE ["+address+"]: "+result);
          req.success = true;
          req.token = result;
          next(req, res, next);
        }
      });
  },

  sendAll : function(address, message, req, res, next) {

      console.log("SEND COMMAND ["+address+"]: "+message);
      req.done = true;
      var sides = [
        { "name": "A", "led": 0, "color": "f00000", "brightness": 100 },
        { "name": "A", "led": 1, "color": "ff0000", "brightness": 100 },
        { "name": "A", "led": 2, "color": "fff000", "brightness": 100 },
        { "name": "A", "led": 3, "color": "ffff00", "brightness": 100 },
        { "name": "A", "led": 4, "color": "fffff0", "brightness": 100 },
        { "name": "A", "led": 5, "color": "ffffff", "brightness": 100 }
      ];
      writeLightingSide(address, sides, 0, writeLightingSide);
  }

};

var writeLightingSide = function(address, sides, index, callback, req, res, next) {

  wire.setAddress(address);
  var bytes = [];
  var message = api.getLightMessage(sides[index].name, '+', sides[index].led, sides[index].color, sides[index].brightness)
  console.log(message);

  for (var i = 0; i < message.length; ++i) {
    bytes.push(message.charCodeAt(i));
  }

  wire.writeBytes(0, bytes, function(err) {

    if (index < sides.length) {
      callback(address, sides, index + 1, writeLightingSide);
    } else {
      console.log('I2C Lighting All >> COMPLETE');
      req.success = true;
      next();
    }

  });
};
