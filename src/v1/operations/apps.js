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

var OPERATION = '/apps';

// ---------------- Operations --------------------------------------------

var requestApps = function (req, res, next) {
  db.getApps(req, res, next);
};

var requestApp = function (req, res, next) {
  db.getApp(req, res, next);
};

var insertApp = function (req, res, next) {
    db.insertApp(req, res, next);
};

var updateApp = function (req, res, next) {
    db.updateApp(req, res, next);
};

var deleteApp = function (req, res, next) {
    db.deleteApp(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestApps], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new App
 */
app.post('/', [insertApp], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get App by id
 */
app.get('/:id', [requestApp], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an App by id
 */
app.put('/:id', [updateApp], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an App by id
 */
app.delete('/:id', [deleteApp], function(req, res) {
  res.json(req.response);
});
