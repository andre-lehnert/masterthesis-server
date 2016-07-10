var i2c = require('./i2c-communication'),
    api = require('./api-model');

// --- Functions ---------------------------------------------------------------

var handleMove = function(receivers, target, command, req, res, next) {
    // var res = {};
    // res.done = false;
    // res.success = false;
    // res.value = -1;
    //

console.log('I2C:handleMove: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

console.log('I2C:handleMove: receiver ['+target+'] available');

            req.update = 'position';

            i2c.send(parseInt(target), command, req, res, next);
        }
      });
    }
};

var handleLight = function(receivers, target, command, req, res, next) {

console.log('I2C:handleLight: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

console.log('I2C:handleLight: receiver ['+target+'] available');

            req.update = 'light';

            i2c.send(parseInt(target), command, req, res, next);
        }
      });
    }
};

var handleAnimation = function(receivers, target, command, req, res, next) {

console.log('I2C:handleAnimation: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

console.log('I2C:handleAnimation: receiver ['+target+'] available');

            req.update = 'animation';

            i2c.send(parseInt(target), command, req, res, next);
        }
      });
    }
};

var handleStatus = function(receivers, target, command, req, res, next) {

console.log('I2C:handleStatus: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

console.log('I2C:handleStatus: receiver ['+target+'] available');

            req.update = 'status';

            i2c.request(parseInt(target), req, res, updateToken);
        }
      });
    }
};

var getTokenId = function(req, res, next) {

  console.log('I2C:getTokenId: TokenLabel: '+req.token);

  // 1) Get Token Id
  db.getToken(req, res, updateTokenId);
};

// 2) Update Bar Token Id
var updateTokenId = function(req, res, next) {

  console.log('I2C:updateTokenId: TokenLabel: '+req.token);

  // 2) Update Bar Token Id
  
};

module.exports = {

  /*
   *
   */
  move : function(req, res, next) {

    var receiver = req.receiver,
        position = req.position,
        speed = req.speed;

console.log('I2C:move: '+receiver+', '+position+' , '+speed);

      // -------------------------------------------------------------------------
      // 1) Validate
      if (
        typeof receiver === 'undefined' ||
        receiver < 0 ||
        receiver < 0x10 ||
        receiver > 0x6e ||
        receiver === 0x0f
      ) {
        return false;
      }

      if (
        typeof position === 'string' ||
        typeof position === 'undefined' ||
        position < 0 ||
        position > 100
      ) {
        return false;
      }

      if (speed === '' || typeof position === 'undefined') speed = stepMode.HALF;

      if (speed != 'full') {
        if (speed != 'half') {
          if (speed != 'quarter') {
            if (speed != 'eigthth') {
              if (speed != 'sixteenth') {
                return false;
              }
            }
          }
        }
      }

console.log('I2C:move:validation: OK');

      // 2) Scan, check available receivers, execute move
      i2c.scan(receiver, api.getMoveMessage(position, speed), handleMove, req, res, next);
  },

  // ----------------------------------------------------------------------

  /*
   *
   */
  light : function(req, res, next) {

    var receiver = req.receiver,
        side = req.side,
        operation = req.operation,
        led = req.lednumber,
        color = req.color,
        brightness = req.brightness;

console.log('I2C:light: '+receiver+', '+side+', '+operation+', '+led+', '+color+', '+brightness);

    // --------------------------------------------------------------------
    // 1) Validate
    if (
      typeof receiver === 'undefined' ||
      receiver < 0 ||
      receiver < 0x10 ||
      receiver > 0x6e ||
      receiver === 0x0f
    ) {
      return false;
    }

    if (typeof side === 'undefined' || side === '') return false;
    if (side.toLowerCase() != 'a') {
      if (side.toLowerCase() != 'b') {
        if (side.toLowerCase() != 'c') {
          if (side.toLowerCase() != 'd') {
            return false;
          }
        }
      }
    }

    if (typeof operation === 'undefined' || operation === '') return false;
    if (operation != '*') {
      if (operation != '+') {
        if (operation != '-') {
          return false;
        }
      }
    }

    if (
      typeof led === 'undefined' ||
      led === '' ||
      typeof led !== 'number' ||
      led < 1 ||
      led > 11
    ) {
      if (operation !== '*') {
        console.log("led");
        return false;
      }
    }

    if (
      typeof color === 'undefined' ||
      color === ''
    ) {
      if (operation === '+') {
        console.log("color");
        return false;
      }
    }

    if (
      typeof brightness === 'undefined' ||
      brightness === '' ||
      typeof brightness !== 'number' ||
      brightness < 0 ||
      brightness > 100
    ) {
      if (operation === '+') {
        console.log("brightness");
        return false;
      }
    }

    console.log('I2C:light:validation: OK');

    // 2) Scan, check available receivers, execute light
    i2c.scan(receiver, api.getLightMessage(side.toLowerCase(), operation, led, color, brightness), handleLight, req, res, next);

  },

  // ----------------------------------------------------------------------

  /**
   *
   */
   animation : function(req, res, next) {

     var receiver = req.receiver,
         animation = req.animation,
         color = req.color,
         brightness = req.brightness,
         speed = req.speed;

     // -------------------------------------------------------------------
     // Validate
     if (
       typeof receiver === 'undefined' ||
       receiver < 0 ||
       receiver < 0x10 ||
       receiver > 0x6e ||
       receiver === 0x0f
     ) {
       return false;
     }

     if (
       typeof animation !== 'string' ||
       animation === ''
     ) {
         return false;
     }

     if (
       typeof color === 'undefined' ||
       color === ''
     ) {
         console.log("color");
         return false;
     }

     if (typeof brightness === 'undefined' || brightness === '')
        brightness = 100;

     if (typeof speed === 'undefined' || speed === '')
        speed = 50;

     console.log('I2C:light:validation: OK');

     // 2) Scan, check available receivers, execute light
     i2c.scan(receiver, api.getAnimationMessage(animation, color, brightness,speed), handleAnimation, req, res, next);
   },

   /**
    *
    *
    * @param  {String} receiver
    * @return {Number}
    */
   status : function(receiver) {

     // -------------------------------------------------------------------
     // Validate
     if (
       typeof receiver === 'undefined' ||
       receiver < 0 ||
       receiver < 0x10 ||
       receiver > 0x6e ||
       receiver === 0x0f
     ) {
       return false;
     }

     console.log('I2C:status:validation: OK');

     var req = {},
         req.receiver = receiver,
         res = {},
         req.token = -1,
         next = function() {};

     // 2) Scan, check available receivers, execute light
     i2c.scan(receiver, api.getStatusMessage(), handleStatus, req, res, next);

    //  var rsp = i2c.sendRequest( receiver );
    //  console.log("REQUEST: "+receiver+" -> "+rsp);
    //  return 4; // 01-cb-18-4f-0e-00-00-96
   }
};

// ------------------------------------------------------------------------
