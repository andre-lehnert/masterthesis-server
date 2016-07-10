// ---------------- Operation --------------------------------------------------

var bodyParser = require('body-parser'),
    express = require('express'),
    // Server
    server = require('./../../../webserver'),
    URL = server.serverUrl,
    // REST-API-Router
    api = require('./../rest-api'),
    // Database Access (salesforce REST-API)
    db = require('./../database/salesforce/database'),

    i2c = require('./../i2c/i2c-controller');
    // Express.js Application
    app = module.exports = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies

// ---------------- API --------------------------------------------------------

var OPERATION = '/animation';


// ---------------- Operations --------------------------------------------

var requestBars = function (req, res, next) {
  db.getBars(req, res, next);
};

var requestBar = function (req, res, next) {
  db.getBar(req, res, next);
};

var requestAnimation = function (req, res, next) {
console.log('Request Animation:');
  db.getAnimation(req, res, next);
};

var sendI2CRequest = function (req, res, next) {

  var id, receiver, animation, speed, color, brightness;

  if (req.response._success) {


    if (req.ledControl) {

      receiver = req.ledControl;
      animation = req.response.object._fields.short_name__c;
      id = req.response.object._fields.id;

      if (!req.params.color)
        color = 'ff0000';
      else
        color = req.params.color;

      if (!req.params.brightness)
        brightness = 100;
      else
        brightness = req.params.brightness;

      if (!req.params.speed)
        speed = 100;
      else
        speed = req.params.speed;

      console.log('>> SEND I2C REQUEST: '+receiver+', '+animation+', '+color+', '+brightness+', '+speed);
      i2c.animation(receiver, animation, color, brightness, speed);
      req.body =
        {
        "animation__c": id,
        "color__c": color,
        "brightness__c": brightness,
        "animation_speed__c": speed
        };

    } else {
      res.send('ERROR: sendI2CRequest(): No LED Controller');
    }
  } else {
    res.send('ERROR: sendI2CRequest(): No Animation Found');
  }
  next();
};


var updateBarAnimation = function (req, res, next) {
  db.updateBar(req, res, next);
};


// ---------------- Routing -----------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestBars], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get a bar by label
 */
app.get('/:label', [requestBar], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label
 */
app.get('/:label/:name', [requestBar, requestAnimation, sendI2CRequest, updateBarAnimation], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label
 */
app.get('/:label/:name/:color', [requestBar, requestAnimation, sendI2CRequest, updateBarAnimation], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label
 */
app.get('/:label/:name/:color/:brightness', [requestBar, requestAnimation, sendI2CRequest, updateBarAnimation], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label
 */
app.get('/:label/:name/:color/:brightness/:speed', [requestBar, requestAnimation, sendI2CRequest, updateBarAnimation], function(req, res) {
 res.json(req.response);
});
