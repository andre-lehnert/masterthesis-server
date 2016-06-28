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

var OPERATION = '/devices';

// ---------------- Operations --------------------------------------------

var requestDevices = function (req, res, next) {
  db.getDevices(req, res, next);
};

var requestDevice = function (req, res, next) {
  db.getDevice(req, res, next);
};

var insertDevice = function (req, res, next) {
    db.insertDevice(req, res, next);
};

var updateDevice = function (req, res, next) {
    db.updateDevice(req, res, next);
};

var deleteDevice = function (req, res, next) {
    db.deleteDevice(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestDevices], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Device
 */
app.post('/', [insertDevice], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Device by id
 */
app.get('/:id', [requestDevice], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Device by id
 */
app.put('/:id', [updateDevice], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Device by id
 */
app.delete('/:id', [deleteDevice], function(req, res) {
  res.json(req.response);
});
