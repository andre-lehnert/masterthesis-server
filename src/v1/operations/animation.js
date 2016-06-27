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

