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

    i2c = require('masterthesis-i2c-library');
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
  db.getAnimation(req, res, next);
};

var sendI2CRequest = function (req, res, next) {
  console.log('sendI2CRequest:');
  console.log(req.resonse);

  var receiver, animation, speed, color, brightness;

  if (req.resonse._success) {
    if (req.ledControl) {

      console.log('receiver:'+req.ledControl);
      console.log('animation:'+req.resonse.short_name__c);
      receiver = req.ledControl;
      animation = req.resonse.short_name__c;

      if (!req.params.color)
        color = '0000ff';
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

      console.log('>> SEND');
      i2c.move(receiver, animation, color, brightness, speed);
      console.log('DONE <<');

    } else {
      res.send('ERROR: sendI2CRequest(): No LED Controller');
    }
  } else {
    res.send('ERROR: sendI2CRequest(): No Animation Found');
  }
  next();
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
app.get('/:label/:animation', [requestBar, requestAnimation], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label
 */
app.get('/:label/:animation/:color', [requestBar, requestAnimation, sendRequest], function(req, res) {
 res.json(req.response);
});
