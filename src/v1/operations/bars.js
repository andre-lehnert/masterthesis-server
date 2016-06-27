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

var OPERATION = '/bars';

// ---------------- Operations --------------------------------------------

var requestBars = function (req, res, next) {
  db.getBars(req, res, next);
};

var requestBar = function (req, res, next) {
  db.getBar(req, res, next);
};

var insertBar = function (req, res, next) {
    db.insertBar(req, res, next);
};

var updateBar = function (req, res, next) {
    db.updateBar(req, res, next);
};

var deleteBar = function (req, res, next) {
    db.deleteBar(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestBars], function(req, res) {
 res.json(req.response);
});

/*
 * ## Insert new bar
 */
app.post('/', [insertBar], function(req, res) {
 res.json(req.response);
});
/*
 * ## Get bar by label
 */
app.get('/:label', [requestBar], function(req, res) {
 res.json(req.response);
});

/*
 * ## Update a bar by label
 */
app.put('/:label', [updateBar], function(req, res) {
 res.json(req.response);
});

/*
 * ## Delete a bar by label
 */
app.delete('/:label', [deleteBar], function(req, res) {
 res.json(req.response);
});
