var i2c = require('./i2c-communication'),
    api = require('./api-model'),
    db  = require('./../database/salesforce/database');
// --- Functions ---------------------------------------------------------------

var handleMove = function(receivers, target, command, req, res, next) {

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

var handleLevel = function(receivers, target, command, req, res, next) {

  console.log('I2C:handleLevel: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

          console.log('I2C:handleLevel: receiver ['+target+'] available');

            req.update = 'level';

            i2c.send(parseInt(target), command, req, res, next);
        }
      });
    }
};

var handleLightAll = function(receivers, target, command, req, res, next) {

  console.log('I2C:handleLightAll: ['+receivers+'], '+target+', '+command);

  if (receivers.length === 0) {

    console.log('NO I2C RECEIVER FOUND');

  } else {

    receivers.forEach(function(val, index, array) {

      if (parseInt(target) === val) {

        console.log('I2C:handleLightAll: receiver ['+target+'] available');
          req.update = 'lightAll';
          i2c.sendAll(parseInt(target), command, req, res, next);
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

//console.log('I2C:handleStatus: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      req._done = false;

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

//console.log('I2C:handleStatus: receiver ['+target+'] available');

            req.update = 'status';

            req.ledReceiver = val + 1; // define led controller via addressing schema

            i2c.request(parseInt(target), req, res, getTokenId);
        }
      });

      if (req._done) next();
    }
};

var getTokenId = function(req, res, next) {

//  console.log('I2C:getTokenId: TokenLabel: '+req.token);

  if (req.token > 0) {
    // 1) Get Token Id
    db.getTokenByDevice(req, res, updateTokenId);
  } else {
    req.response = {};
    req.response._fields = {};
    req.response._fields.id = null //'';
    req.response._fields.app__c = null;
    updateTokenId(req, res, next);
  }
};

// 2) Update Bar Token Id
var updateTokenId = function(req, res, next) {

//  console.log('I2C:updateTokenId: TokenLabel: '+req.token+' ID: '+req.response._fields.id+ ' OLD TokenId: '+req.tokenid+', OLD LABEL: '+req.response._fields.label__c);
//  console.log(req.tokenid);
//  console.log(req.response._fields.id);

  if (req.tokenid != req.response._fields.id) {

    req.tokenid = req.response._fields.id;

    req.body = { 'token__c' : req.response._fields.id, 'app__c' : req.response._fields.app__c };

  //console.log('>> Update Bar ['+req.params.label+']');


    // Level Lighting Parameter
    //
    //
    req.receiver = req.ledReceiver;
    req.lednumber = 1;
    req.color = req.response._fields.app_color__c;
    req.brightness = 100;

    console.log(">>>> UPDATE BAR");

    // 2) Update Bar Token Id
    db.updateBarByDevice(req, res, level);
    

  } else {
//    console.log('>> TOKEN NOT CHANGED');
  }
};

var level =  function(req, res, next) {

if (typeof req != 'undefined') {

console.log(">>> LEVEL "+req.ledReceiver+" -> "+req.color);

    var receiver = req.ledReceiver,
        led = 11,
        color = req.color,
        brightness = req.brightness;

        console.log('I2C:level: '+receiver+', '+led+', '+color+', '+brightness);

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

    if (
      typeof led === 'undefined' ||
      led === '' ||
      typeof led !== 'number' ||
      led < 1 ||
      led > 11
    ) {
        return false;
    }

    if (
      typeof color === 'undefined' ||
      color === ''
    ) {
      
        return false;
      
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

    // 2) Scan, check available receivers, execute level
    i2c.scan(receiver, api.getLevelMessage(led, color, brightness), handleLevel, req, res, next);
}

};



var getAvailableBars = function(receivers, target, command, req, res, next) {

//console.log('I2C:handleStatus: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');
      req.availableBars = [];
      req.response.objects = [];
      req.response._count = 0;

      next();
    } else {
      var bars = [];

      for (var i = 0; i < receivers.length; i = i + 2) {
        console.log(receivers[i]+" - "+receivers[i+1]);
        if (receivers[i] % 2 == 0 && receivers[i+1] % 2 != 0) {
          bars.push({ "motor": receivers[i], "led": receivers[i+1] });
        }
      }
      console.log('>> Available Bars: '+bars.length);
      req.availableBars = bars;


//console.log('Length: '+req.response.objects.length);

      var objs = [];

      if (req.response.objects.length > 0)
      for (var i = 0; i < req.response.objects.length; i++) {
        console.log(req.response.objects[i]);
        for (var j = 0; j < bars.length; j++) {

          if (req.response.objects[i]._fields.motor__c == bars[j].motor &&
            req.response.objects[i]._fields.led__c == bars[j].led) {
            objs.push(req.response.objects[i]._fields);
          }

        }
      }


      req.response.objects = objs;
      req.response._count = objs.length;

//      console.log('Objects: '+ req.response.objects+' _count = '+req.response._count);


      next();
    }
};

var handleCalibration = function(receivers, target, command, req, res, next) {

console.log('I2C:handleCalibration: ['+receivers+'], '+target+', '+command);

    if (receivers.length === 0) {

      console.log('NO I2C RECEIVER FOUND');

    } else {

      receivers.forEach(function(val, index, array) {

        if (parseInt(target) === val) {

          console.log('I2C:handleCalibration: receiver ['+target+'] available');

            req.update = 'calibration';

            i2c.send(parseInt(target), command, req, res, next);
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

//console.log('I2C:move:validation: OK');

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

    //console.log('I2C:light:validation: OK');

    // 2) Scan, check available receivers, execute light
    i2c.scan(receiver, api.getLightMessage(side.toLowerCase(), operation, led, color, brightness), handleLight, req, res, next);

  },

  // ----------------------------------------------------------------------

  /*
   *
   */
  level : function(req, res, next) {

    var receiver = req.receiver,
        led = req.lednumber,
        color = req.color,
        brightness = req.brightness;

        console.log('I2C:level: '+receiver+', '+led+', '+color+', '+brightness);

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

    if (
      typeof led === 'undefined' ||
      led === '' ||
      typeof led !== 'number' ||
      led < 1 ||
      led > 11
    ) {
        return false;
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

    // 2) Scan, check available receivers, execute level
    i2c.scan(receiver, api.getLevelMessage(led, color, brightness), handleLevel, req, res, next);

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

     //console.log('I2C:light:validation: OK');

     // 2) Scan, check available receivers, execute light
     i2c.scan(receiver, api.getAnimationMessage(animation, color, brightness,speed), handleAnimation, req, res, next);
   },

   /**
    *
    *
    * @param  {String} receiver
    * @return {Number}
    */
   status : function(bar) {

     if (typeof bar == 'undefined') return;

     var receiver = bar.motor__c,
         barlabel = bar.label__c,
         token = bar.token__c;

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

     var req = {};
         req.receiver = receiver;
         req.token = -1;
         req.tokenid = token;
         req.params = {};
         req.params.label = barlabel;

     var res = {};
     var next = function() {};

     // 2) Scan, check available receivers, execute light
     i2c.scan(receiver, api.getStatusMessage(), handleStatus, req, res, next);

   },

   lightAll : function(req, res, next) {

     var receiver = req.body.sideJson.receiver;
        //  sideA = req.body.sideA,
        //  sideB = req.body.sideB,
        //  sideC = req.body.sideC,
        //  sideD = req.body.sideD,
        //  brightness = req.brightness;

     console.log('I2C:lightAll: '+receiver);

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

     // 2) Scan, check available receivers, execute light
     i2c.scan(receiver, '', handleLightAll, req, res, next);

   },

   getBars : function(req, res, next) {
     i2c.scan(16, '', getAvailableBars, req, res, next);
   },

   calibrateBar : function(req, res, next) {

     var receiver = req.receiver;

     if (
       typeof receiver === 'undefined' ||
       receiver < 0 ||
       receiver < 0x10 ||
       receiver > 0x6e ||
       receiver === 0x0f ||
       receiver % 2 != 0
     ) {
       return false;
     }

     i2c.scan(receiver, api.getCalibrateMessage(), handleCalibration, req, res, next);
   },

};

// ------------------------------------------------------------------------
