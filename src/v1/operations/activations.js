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

var OPERATION = '/activations';

// ---------------- Operations --------------------------------------------

var requestActivations = function (req, res, next) {
  db.getActivations(req, res, next);
};

var requestActivation = function (req, res, next) {
  db.getActivation(req, res, next);
};

var insertActivation = function (req, res, next) {
    db.insertActivation(req, res, next);
};

var updateActivation = function (req, res, next) {
    db.updateActivation(req, res, next);
};

var deleteActivation = function (req, res, next) {
    db.deleteActivation(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestActivations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Activation
 */
app.post('/', [insertActivation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Activation by id
 */
app.get('/:id', [requestActivation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Activation by id
 */
app.put('/:id', [updateActivation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Activation by id
 */
app.delete('/:id', [deleteActivation], function(req, res) {
  res.json(req.response);
});
