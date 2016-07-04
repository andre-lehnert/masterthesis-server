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

var OPERATION = '/light';


// ---------------- Operations --------------------------------------------

var requestBars = function (req, res, next) {
  db.getBars(req, res, next);
};

var requestBar = function (req, res, next) {
  db.getBar(req, res, next);
};

var requestSide = function (req, res, next) {
  db.getSideByLabel(req, res, next);
};

var requestAllSides = function (req, res, next) {
  db.getSidesByBar(req, res, next);
};

var sendI2CRequest = function (req, res, next) {

  var id, receiver, side, operation, lednumber, color, brightness;

  if (req.response._success) {


    if (req.ledControl) {

      receiver = req.ledControl;
      id = req.response.object._fields.id;
      lednumber = req.params.led;
      operation = req.params.operation;
      side = req.selectedSide;

      if (!req.params.color)
        color = 'ff0000';
      else
        color = req.params.color;

      if (!req.params.brightness)
        brightness = 100;
      else
        brightness = parseInt(req.params.brightness);

      if (operation.toLowerCase() === 'new')
        operation = '*';
      else if (operation.toLowerCase() === 'add')
        operation = '+';
      else if (operation.toLowerCase() === 'remove')
        operation = '-';

      if (typeof lednumber === 'number')
        lednumber = parseInt(req.params.led) + 1;
      else
        res.send('ERROR: sendI2CRequest(): Invalid LED Number (0-10)');


      console.log('>> SEND I2C REQUEST: '+receiver+', '+operation+', '+lednumber+', '+color+', '+brightness);
      i2c.light(receiver, side, operation, led, color, brightness);
      req.body =
        {

        };

    } else {
      res.send('ERROR: sendI2CRequest(): No LED Controller');
    }
  } else {
    res.send('ERROR: sendI2CRequest(): No Side Found');
  }
  next();
};


var updateBarSides = function (req, res, next) {
  //db.updateSides(req, res, next);
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
app.get('/:label', [requestBar, requestAllSides], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d)
 */
app.get('/:label/:side', [requestBar, requestSide], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d)  operation (new, add, remove)
 */
app.get('/:label/:side/:operation', function(req, res) {
 res.json(
   {
     "leds" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
   }
  );
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d), operation (new, add, remove), led number (0-10),
 */
app.get('/:label/:side/:operation/:led', [requestBar, requestSide, sendI2CRequest, updateBarSides], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d), operation (new, add, remove), led number (0-10), color (ff0000)
 */
app.get('/:label/:side/:operation/:led/:color', [requestBar, requestSide, sendI2CRequest, updateBarSides], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d), operation (new, add, remove), led number (0-10), color (ff0000), brightness (0-100)
 */
app.get('/:label/:side/:operation/:led/:color/:brightness', [requestBar, requestSide, sendI2CRequest, updateBarSides], function(req, res) {
 res.json(req.response);
});
