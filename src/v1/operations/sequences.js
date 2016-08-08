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
    // Express.js Devicelication
    app = module.exports = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies

// ---------------- API --------------------------------------------------------

var OPERATION = '/sequences';

// ---------------- Operations --------------------------------------------

var requestSequences = function (req, res, next) {
  db.getSequences(req, res, next);
};

var requestSequence = function (req, res, next) {
  db.getSequence(req, res, next);
};

var insertSequence = function (req, res, next) {
    db.insertSequence(req, res, next);
};

var updateSequence = function (req, res, next) {
    db.updateSequence(req, res, next);
};

var deleteSequence = function (req, res, next) {
    db.deleteSequence(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all Sequences
 */
app.get('/', [requestSequences], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Sequence
 */
app.post('/', [insertSequence], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Sequence by id
 */
app.get('/:id', [requestSequence], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Sequence by id
 */
app.put('/:id', [updateSequence], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Sequence by id
 */
app.delete('/:id', [deleteSequence], function(req, res) {
  res.json(req.response);
});
