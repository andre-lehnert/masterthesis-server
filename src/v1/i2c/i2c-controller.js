var i2c = require('./i2c-communication'),
    api = require('./api-model');

// --- Functions ---------------------------------------------------------------

var handleMove = function(receivers, target, command, res, next) {
    // var res = {};
    // res.done = false;
    // res.success = false;
    // res.value = -1;
    //
    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {
            i2c.send(parseInt(target), command, res, next);
        }
      });
    }
};

module.exports = {

  /*
   *
   */
  move : function(req, res, next) {

    var receiver = req.receiver,
        position = req.position,
        speed = req.speed;

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

      // 2) Scan, check available receivers, execute move
      i2c.scan(receiver, api.getMoveMessage(position, speed), handleMove, res, next);
  },

  // ----------------------------------------------------------------------
  /**
   *
   *
   * @param  {String} receiver
   * @param  {String} side
   * @param  {String} operation
   * @param  {Number} led
   * @param  {String} color
   * @param  {Number} brightness
   * @return {Boolean}
   */
  light : function(req, res, next) {

    var receiver = req.receiver,
        side = req.side,
        operation = req.operation,
        led = req.led,
        color = req.color,
        brightness = req.brightness;

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

    //i2c.sendMessage( receiver, api.getLightMessage(side.toLowerCase(), operation, led, color, brightness) );
  },

  // ----------------------------------------------------------------------
  /**
   *
   *
   * @param  {String} receiver
   * @param  {String} animation
   * @param  {String} color
   * @param  {Number} brightness
   * @param  {Number} speed
   * @return {Boolean}
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

    //  i2c.sendMessage( receiver, api.getAnimationMessage(animation, color, brightness,speed) );
     //
    //  return true;
   },

   /**
    *
    *
    * @param  {String} receiver
    * @return {Number}
    */
   status : function(req, res, next) {
     
     var receiver = req.receiver;

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

    //  var rsp = i2c.sendRequest( receiver );
    //  console.log("REQUEST: "+receiver+" -> "+rsp);
    //  return 4; // 01-cb-18-4f-0e-00-00-96
   }
};

// ------------------------------------------------------------------------
