var i2c = require('i2c');
var MASTER = 0x0f;
var wire  = new i2c(MASTER, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface

module.exports = {

  scan : function(target, command, callback, req, res, next) {

console.log('I2C:scan: '+target+', '+command);

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
      res.done = true;

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
              "animation__c": req.animation,
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

      console.log("REQUEST ["+address+"]");
      req.done = true;

      wire.setAddress(address);

      wire.readByte(function(err, result) {
        if (err != null) {
          console.log("ERROR: "+err);
          next();
        } else {
          console.log("RECEIVE ["+address+"]: "+result);
          req.success = true;
          req.value = result;
          next();
        }
      });
  }

};
