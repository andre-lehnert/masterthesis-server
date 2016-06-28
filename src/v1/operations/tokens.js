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

var OPERATION = '/tokens';

// ---------------- Operations --------------------------------------------

var requestTokens = function (req, res, next) {
  db.getTokens(req, res, next);
};

var requestToken = function (req, res, next) {
  db.getToken(req, res, next);
};

var insertToken = function (req, res, next) {
    db.insertToken(req, res, next);
};

var updateToken = function (req, res, next) {
    db.updateToken(req, res, next);
};

var deleteToken = function (req, res, next) {
    db.deleteToken(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestTokens], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Token
 */
app.post('/', [insertToken], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Token by id
 */
app.get('/:label', [requestToken], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Token by id
 */
app.put('/:label', [updateToken], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Token by id
 */
app.delete('/:label', [deleteToken], function(req, res) {
  res.json(req.response);
});
