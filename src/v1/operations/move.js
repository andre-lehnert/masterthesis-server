// ---------------- Operation ---------------------------------------------

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

// ---------------- API ---------------------------------------------------

var OPERATION = '/move';


// ---------------- Operations --------------------------------------------

var requestBars = function (req, res, next) {
  db.getBars(req, res, next);
};

var requestBar = function (req, res, next) {
  db.getBar(req, res, next);
};

var sendI2CRequest = function (req, res, next) {

  console.log(req.response);

  var id, receiver, targetPosition, speed;

  if (req.response._success) {

    receiver = req.motorControl;
    id = req.response.object._fields.id;
    targetPosition = parseInt(req.params.position);

    if (!req.params.speed)
      speed = 'half';
    else
      speed = req.params.speed;

    // Send I2C Command
    console.log('>> SEND I2C REQUEST: '+receiver+', '+targetPosition+', '+speed);
    i2c.move(receiver, targetPosition, speed);

    // New Position
    req.body =
      {
      "position__c": targetPosition
      };

  } else {
    res.send('ERROR: sendI2CRequest(): No Bar Found');
  }
  next();
};

var updateBarPosition = function (req, res, next) {
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
 * ## Move a bar to :position
 */
app.get('/:label/:position', [requestBar, sendI2CRequest, updateBarPosition], function (req, res) {
  res.json(req.response);
});

/*
 * ## Move a bar to :position with :speed
 */
app.get('/:label/:position/:speed', [requestBar, sendI2CRequest, updateBarPosition], function (req, res) {
  res.json(req.response);
});
