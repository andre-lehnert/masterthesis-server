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

var moveBar = function (req, res, next) {

  if (req.response._success) {
console.log('SPEED:'+req.params.speed);
    if (!req.params.speed)
      i2c.move(req.response.object.motor__c, req.params.position, 'half');
    else
      i2c.move(req.response.object.motor__c, req.params.position, req.params.speed);
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
 * ## Move a bar to :position
 */
app.get('/:label/:position', [requestBar, moveBar], function (req, res) {
  res.json(req.response);
});

/*
 * ## Move a bar to :position with :speed
 */
app.get('/:label/:position/:speed', [requestBar, moveBar], function (req, res) {
  res.json(req.response);
});
