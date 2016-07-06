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

      operation = req.params.operation;
      lednumber = req.params.led;

      if (operation.toLowerCase() != 'new' &&
          typeof lednumber == 'undefined') {

         res.json(
         {
           "leds" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
         });
	 next();

      } else if (operation.toLowerCase() == 'new') {
        lednumber = 0;
      }

      receiver = req.ledControl;
      id = req.response.object._fields.id;
      operation = req.params.operation;
      side = req.selectedSide;
       var leds;

      if (operation.toLowerCase() != 'new')
        leds = Array(11); //[ null,  null,  null,  null,  null,  null,  null,  null,  null,  null,  null ];
      else
        leds = [ '000000','000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000' ];

      if (!req.params.color)
        color = 'ff0000';
      else
        color = req.params.color;

      if (operation.toLowerCase() === 'remove')
        color = '000000';

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

      lednumber = parseInt(req.params.led) + 1;
                  
      switch (lednumber) {
        case 1: leds[0] = color; break;
        case 2: leds[1] = color; break;
        case 3: leds[2] = color; break;
        case 4: leds[3] = color; break;
        case 5: leds[4] = color; break;
        case 6: leds[5] = color; break;
        case 7: leds[6] = color; break;
        case 8: leds[7] = color; break;
        case 9: leds[8] = color; break;
        case 10: leds[9] = color; break;
        case 11: leds[10] = color; break;
        default: break;
      }


      console.log('>> SEND I2C REQUEST: '+receiver+', '+operation+', '+lednumber+', '+color+', '+brightness);
      i2c.light(receiver, side, operation, lednumber, color, brightness);
      req.body =
        {
          "led_0__c": leds[0],
          "led_1__c": leds[1],
          "led_2__c": leds[2],
          "led_3__c": leds[3],
          "led_4__c": leds[4],
          "led_5__c": leds[5],
          "led_6__c": leds[6],
          "led_7__c": leds[7],
          "led_8__c": leds[8],
          "led_9__c": leds[9],
          "led_10__c": leds[10],
          "label__c": side
        };
      req.sideId = id;
      console.log('ID: '+req.sideId );

    } else {
      res.send('ERROR: sendI2CRequest(): No LED Controller');
    }
  } else {
    res.send('ERROR: sendI2CRequest(): No Side Found');
  }
  next();
};


var updateBarSides = function (req, res, next) {
  db.updateSideByBar(req, res, next);
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
app.get('/:label/:side/:operation', [requestBar, requestSide, sendI2CRequest, updateBarSides], function(req, res) {
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
