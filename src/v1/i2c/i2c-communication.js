var i2c = require('i2c');
var MASTER = 0x0f;
var wire  = new i2c(MASTER, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface

module.exports = {

scan : function(target, command, callback) {

  wire.scan(function(err, data) {
    // result contains an array of addresses
    if (!err) {
      console.log('I2C RECEIVERS: '+data);

      if (typeof command != 'undefined' && typeof target != 'undefined') 
        if (command != 'SCAN')
          callback(data, target, command);
    } else {
      console.log('ERROR: '+err);
    }
  });

},

send : function(address, message, res, response) {

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
        response(res);
      } else {
        res.success = true;
        response(res);
      }
    });
},

request : function(address, res, response) {

    console.log("REQUEST ["+address+"]");
    res.done = true;

    wire.setAddress(address);

    wire.readByte(function(err, result) {
      if (err != null) {
        console.log("ERROR: "+err);
        response(res);
      } else {
        console.log("RECEIVE ["+address+"]: "+result);
        res.success = true;
        res.value = result;
        response(res);
      }
    });
}

};
