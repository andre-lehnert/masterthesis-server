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

var OPERATION = '/sides';

// ---------------- Operations --------------------------------------------

var requestSides = function (req, res, next) {
  db.getSides(req, res, next);
};

var requestSide = function (req, res, next) {
  db.getSide(req, res, next);
};

var insertSide = function (req, res, next) {
    db.insertSide(req, res, next);
};

var updateSide = function (req, res, next) {
    db.updateSide(req, res, next);
};

var deleteSide = function (req, res, next) {
    db.deleteSide(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestSides], function(req, res) {
 res.json(req.response);
});

/*
 * ## Insert new Side
 */
app.post('/', [insertSide], function(req, res) {
 res.json(req.response);
});
/*
 * ## Get Side by id
 */
app.get('/:id', [requestSide], function(req, res) {
 res.json(req.response);
});

/*
 * ## Update a Side by id
 */
app.put('/:id', [updateSide], function(req, res) {
 res.json(req.response);
});

/*
 * ## Delete a Side by id
 */
app.delete('/:id', [deleteSide], function(req, res) {
 res.json(req.response);
});
