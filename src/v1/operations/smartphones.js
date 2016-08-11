// ---------------- Operation --------------------------------------------------
var bodyParser = require('body-parser'),
    express = require('express'),
    // Server
    server = require('./../../../webserver'),
    URL = server.serverUrl,
    // REST-API-Router
    api = require('./../rest-api'),
    // Database Access (salesforce REST-API)
    db = require('./../database/salesforce/database');
    // Express.js Application
    app = module.exports = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies

// ---------------- API --------------------------------------------------------

var OPERATION = '/smartphones';

// ---------------- Operations --------------------------------------------

var requestSmartphones = function (req, res, next) {
  db.getSmartphones(req, res, next);
};

var requestSmartphone = function (req, res, next) {
  db.getSmartphone(req, res, next);
};

var insertSmartphone = function (req, res, next) {
    db.insertSmartphone(req, res, next);
};

var updateSmartphone = function (req, res, next) {
    db.updateSmartphone(req, res, next);
};

var deleteSmartphone = function (req, res, next) {
    db.deleteSmartphone(req, res, next);
};


var requestApps = function (req, res, next) {
  db.getAppsBySmartphone(req, res, next);
};

var requestApp = function (req, res, next) {
  db.getAppBySmartphone(req, res, next);
};


var requestNotifications = function (req, res, next) {
  db.getNotificationsBySmartphoneApp(req, res, next);
};

var requestInvocations = function (req, res, next) {
  db.getInvocationsBySmartphoneApp(req, res, next);
};

var requestInvocationsBySmartphone = function (req, res, next) {
  db.getInvocationsBySmartphone(req, res, next);
};

var requestNotification = function (req, res, next) {
  db.getNotificationByApp(req, res, next);
};

var requestInvocation = function (req, res, next) {
  db.getInvocationByApp(req, res, next);
};


var insertNotification = function (req, res, next) {




    db.insertNotification(req, res, next);
};

var insertInvocation = function (req, res, next) {
    db.insertInvocation(req, res, next);
};


var requestActivations = function (req, res, next) {
  db.getActivationsBySmartphone(req, res, next);
};

var requestActivation = function (req, res, next) {
  db.getActivationBySmartphone(req, res, next);
};

var insertActivation = function (req, res, next) {
    db.insertActivation(req, res, next);
};



var requestNotifications = function (req, res, next) {
  db.getNotificationsBySmartphone(req, res, next);
};

var requestNotification = function (req, res, next) {
  db.getNotificationByApp(req, res, next); // use :notification id
};

var insertNotification = function (req, res, next) {
    db.insertNotification(req, res, next);
};





// POST /notifications

var requestTokensByApp = function (req, res, next) {
  db.getTokensByApp(req, res, next);
};

var requestActiveApp = function(req, res, next) {

  var appId = req.param.app;

  // Get Notification App
  if (typeof req.notification != 'undefined') {

    appId = req.notification.appId;
    console.log("NOTIFICATION APP ["+appId+"]");

  } else if (typeof req.invocation != 'undefined') {

    appId = req.invocation.appId;
    console.log("INVOCATION APP ["+appId+"]");
  }

  req.noti = {};
  req.noti.app = appId.substring(0, 15); // active app

  if (req.response.objects.length > 0) {

    console.log(req.response.objects[0]._fields);
    if (appId === req.response.objects[0]._fields.app__c) {

      req.params = {};
      req.params.app = appId.substring(0, 15); // active app

      console.log("GET APP BY SMARTPHONE: "+req.params.app);
      db.getAppBySmartphone(req, res, next);

    } else {
      next();
    }

  } else {
    next();
  }

};

var requestBar = function (req, res, next) {

  if (req.response.object) {

    req.noti.animation = {};
    req.noti.animation.id = req.response.object._fields.animation__c;
    req.noti.animation.name = req.response.object._fields.animation_name__c;
    req.noti.animation.shortName = req.response.object._fields.animation_short_name__c;
    req.noti.animation.color = req.response.object._fields.color__c;
    req.noti.animation.speed = req.response.object._fields.animation_speed__c;
    req.noti.animation.brightness = req.response.object._fields.brightness__c;

    var appId = req.param.app;

    // Get Notification App
    if (typeof req.notification != 'undefined') {

      appId = req.notification.appId;
      console.log("NOTIFICATION APP ["+appId+"]");

    } else if (typeof req.invocation != 'undefined') {

      appId = req.invocation.appId;
      console.log("INVOCATION APP ["+appId+"]");
    }


    req.params = {};
    req.params.app = appId.substring(0, 15); // active app

    console.log("REQUEST RECEIVER BY APP ["+req.params.app+"]");

    db.getBarsByApp(req, res, next);

  } else {
    console.log(">>> NO ACTIVE BAR FOUND!");
    next();
  }
};

var animateBar = function(req, res, next) {

  if (req.response.objects.length > 0) {

    //console.log(req.response.objects[0]._fields);

    req.noti.bar = {};
    req.noti.bar.id = req.response.objects[0]._fields.id;
    req.noti.bar.label = req.response.objects[0]._fields.label__c;
    req.noti.bar.motor = req.response.objects[0]._fields.motor__c;
    req.noti.bar.led = req.response.objects[0]._fields.led__c;
    req.noti.bar.position = req.response.objects[0]._fields.position__c;
    req.noti.bar.notifications = req.response.objects[0]._fields.current_notifications__c;
    req.noti.bar.calibrated = req.response.objects[0]._fields.calibrated__c;

    console.log("//////////////// NOTIFICATION /////////////");

    console.log("---------------- BAR ----------------------");
    console.log("Label:\t\t"+req.noti.bar.label);
    console.log("Position:\t"+req.noti.bar.position);
    console.log("Notifications:\t"+req.noti.bar.notifications);
    console.log("IsCalibrated:\t"+req.noti.bar.calibrated);
    console.log("I2C:\t\t"+req.noti.bar.motor+"\t"+req.noti.bar.led);
    console.log("-------------------------------------------");

    console.log("---------------- ANIMATION ----------------");
    console.log("Animation:\t"+req.noti.animation.name+" ("+req.noti.animation.shortName+")");
    console.log("Color:\t\t#"+req.noti.animation.color);
    console.log("Speed:\t\t"+req.noti.animation.speed);
    console.log("Brightness:\t"+req.noti.animation.brightness);
    console.log("-------------------------------------------");

    console.log("///////////////////////////////////////////");

    var id, receiver, animation, speed, color, brightness;

    if (req.response._success) {

      if (req.noti.bar.led) {

        receiver = req.noti.bar.led;
        animation = req.noti.animation.shortName;
        id = req.noti.bar.id;

        if (!req.noti.animation.color)
          color = 'ff0000';
        else
          color = req.noti.animation.color;

        if (!req.noti.animation.brightness)
          brightness = 100;
        else
          brightness = req.noti.animation.brightness;

        if (!req.noti.animation.speed)
          speed = 100;
        else
          speed = req.noti.animation.speed;

        req.receiver = receiver;
        req.id = id;
        req.animation = animation;
        req.color = color;
        req.brightness = brightness;
        req.speed = speed;

        console.log('>> SEND I2C REQUEST: '+receiver+', '+animation+', '+color+', '+brightness+', '+speed);
        i2c.animation(req, res, next);

      } else {
        res.send('ERROR: sendI2CRequest(): No LED Controller');
        next();
      }
    } else {
      res.send('ERROR: sendI2CRequest(): No Animation Found');
      next();
    }

  }

  next();
};

var stopAnimation = function(req, res, next) {

  if (req.response.objects.length > 0) {

    //console.log(req.response.objects[0]._fields);

    req.noti.bar = {};
    req.noti.bar.id = req.response.objects[0]._fields.id;
    req.noti.bar.label = req.response.objects[0]._fields.label__c;
    req.noti.bar.motor = req.response.objects[0]._fields.motor__c;
    req.noti.bar.led = req.response.objects[0]._fields.led__c;
    req.noti.bar.position = 0; // RESET
    req.noti.bar.notifications = 0; // RESET
    req.noti.bar.calibrated = req.response.objects[0]._fields.calibrated__c;

    req.noti.animation.id = 'a0D58000000BovLEAS'; // switch-off

    console.log("//////////////// INVOCATION ///////////////");

    console.log("---------------- BAR ----------------------");
    console.log("Label:\t\t"+req.noti.bar.label);
    console.log("Position:\t"+req.noti.bar.position);
    console.log("Notifications:\t"+req.noti.bar.notifications);
    console.log("IsCalibrated:\t"+req.noti.bar.calibrated);
    console.log("I2C:\t\t"+req.noti.bar.motor+"\t"+req.noti.bar.led);
    console.log("-------------------------------------------");

    console.log("---------------- ANIMATION ----------------");
    console.log("Animation:\t"+req.noti.animation.name+" ("+req.noti.animation.shortName+")");
    console.log("Color:\t\t#"+req.noti.animation.color);
    console.log("Speed:\t\t"+req.noti.animation.speed);
    console.log("Brightness:\t"+req.noti.animation.brightness);
    console.log("-------------------------------------------");

    console.log("///////////////////////////////////////////");

    var id, receiver, animation, speed, color, brightness;

    if (req.response._success) {

      if (req.noti.bar.led) {

        receiver = req.noti.bar.led;
        animation = req.noti.animation.shortName;
        id = req.noti.bar.id;

        if (!req.noti.animation.color)
          color = 'ff0000';
        else
          color = req.noti.animation.color;

        if (!req.noti.animation.brightness)
          brightness = 100;
        else
          brightness = req.noti.animation.brightness;

        if (!req.noti.animation.speed)
          speed = 100;
        else
          speed = req.noti.animation.speed;

        req.receiver = receiver;
        req.id = id;
        req.animation = animation;
        req.color = color;
        req.brightness = brightness;
        req.speed = speed;

        console.log('>> SEND I2C REQUEST: '+receiver+', '+animation+', '+color+', '+brightness+', '+speed);
        i2c.animation(req, res, next);

      } else {
        res.send('ERROR: sendI2CRequest(): No LED Controller');
        next();
      }
    } else {
      res.send('ERROR: sendI2CRequest(): No Animation Found');
      next();
    }

  }

  next();
};

var moveBar = function(req, res, next) {

    if (req.response.objects.length > 0 && typeof req.noti.bar != 'undefined') {

      var id, receiver, targetPosition, speed;

      receiver = req.noti.bar.motor;
      id = req.noti.bar.id;

      if (typeof req.noti.bar.notifications != 'undefined') {

        // notifications [0,40] -> [0,100]
        // (5/4)*40 + 50 = 100
        if (typeof req.noti.bar.notifications == 'number' && req.noti.bar.position < 100) {

          // Add current notification
          req.noti.bar.notifications++;

          var x = req.noti.bar.notifications;

          // discrete logarithm [0-100]
          if (req.noti.bar.notifications <= 10) {

            req.noti.bar.position = (5/1) * x;

          } else if (req.noti.bar.notifications <= 20) {

            req.noti.bar.position = (5/2) * x + 25;

          } else if (req.noti.bar.notifications <= 40) {

            req.noti.bar.position = (5/4) * x + 50;

          } else {
            next();
          }

          targetPosition = req.noti.bar.position;

          console.log("Current Notifications: "+req.noti.bar.notifications+" ~~~> Target Position: "+targetPosition);

          speed = 'half';

          // Send I2C Command
          console.log('>> SEND I2C REQUEST: '+receiver+', '+targetPosition+', '+speed);

          req.receiver = receiver;
          req.position = targetPosition;
          req.speed = speed;

          i2c.move(req, res, next);

        } else {
          console.log('=> 100 % already reached -> NO CHANGES');
          next();
        }

      } else {
        console.log('WARN: bar.current_notifications__c not defined or set');
        next();
      }

    } else {
      next();
    }
};

var resetPosition = function(req, res, next) {

  if (req.response.objects.length > 0 && typeof req.noti.bar != 'undefined') {

    var id, receiver, targetPosition, speed;

    receiver = req.noti.bar.motor;
    id = req.noti.bar.id;
    targetPosition = req.noti.bar.position;

    console.log("After App Invocation -> Current Notifications: "+req.noti.bar.notifications+" ~~~> Target Position: "+targetPosition);

    speed = 'quarter';

    // Send I2C Command
    console.log('>> SEND I2C REQUEST: '+receiver+', '+targetPosition+', '+speed);

    req.receiver = receiver;
    req.position = targetPosition;
    req.speed = speed;

    i2c.move(req, res, next);

  } else {

    next();
  }

};


var updateBarAfterEvent = function(req, res, next) {

  if (typeof req.noti.bar != 'undefined') {
    db.updateBarAfterNotification(req, res, next);
  } else {
    next();
  }

};

var empty = function(req,res,next) {}

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestSmartphones], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Smartphone
 */
app.post('/', [insertSmartphone], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone by id
 */
app.get('/:id', [requestSmartphone], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone Apps by id
 */
app.get('/:id/apps', [requestApps], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone App by App id
 */
app.get('/:id/apps/:app', [requestApp], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone Notifications by App id
 */
app.get('/:id/apps/:app/notifications', [requestNotifications], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone Notification by App id
 */
app.get('/:id/apps/:app/notifications/:notification', [requestNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Notification & animate bar if monitored
 */
app.post('/:id/apps/:app/notifications', [insertNotification, requestTokensByApp, requestActiveApp, requestBar, animateBar, moveBar, updateBarAfterEvent, empty], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone invocations by App id
 */
app.get('/:id/apps/:app/invocations', [requestInvocations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone invocation by App id
 */
app.get('/:id/apps/:app/invocations/:invocation', [requestInvocation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Invocation
 */
app.post('/:id/apps/:app/invocations', [insertInvocation, requestTokensByApp, requestActiveApp, requestBar, stopAnimation, resetPosition, updateBarAfterEvent,empty], function(req, res) {
  res.json(req.response);
});


/*
 * ## Get Smartphone Activations by App id
 */
app.get('/:id/activations', [requestActivations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone Activation by App id
 */
app.get('/:id/activations/:activation', [requestActivation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Activation
 */
app.post('/:id/activations', [insertActivation], function(req, res) {
  res.json(req.response);
});




app.get('/:id/notifications', [requestNotifications], function(req, res) {
  res.json(req.response);
});

app.get('/:id/notifications/:notification', [requestNotification], function(req, res) {
  res.json(req.response);
});

app.get('/:id/invocations', [requestInvocationsBySmartphone], function(req, res) {
  res.json(req.response);
});

app.get('/:id/invocations/:invocation', [requestInvocation], function(req, res) {
  res.json(req.response);
});


/*
 * ## Update an Smartphone by id
 */
app.put('/:id', [updateSmartphone], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Smartphone by id
 */
app.delete('/:id', [deleteSmartphone], function(req, res) {
  res.json(req.response);
});
