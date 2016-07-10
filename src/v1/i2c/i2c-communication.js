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
