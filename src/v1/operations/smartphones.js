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

var OPERATION = '/smartphones';

// ---------------- Operations --------------------------------------------

var requestSmartphones = function (req, res, next) {
  db.getSmartphones(req, res, next);
};

var requestSmartphone = function (req, res, next) {
  db.getSmartphone(req, res, next);
};

var insertSmartphone = function (req, res, next) {
    db.insertSmartphone(req, res, next);
};

var updateSmartphone = function (req, res, next) {
    db.updateSmartphone(req, res, next);
};

var deleteSmartphone = function (req, res, next) {
    db.deleteSmartphone(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestSmartphones], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Smartphone
 */
app.post('/', [insertSmartphone], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone by id
 */
app.get('/:id', [requestSmartphone], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Smartphone by id
 */
app.put('/:id', [updateSmartphone], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Smartphone by id
 */
app.delete('/:id', [deleteSmartphone], function(req, res) {
  res.json(req.response);
});
