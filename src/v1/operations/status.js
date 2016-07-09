// ---------------- Operation --------------------------------------------------

var express = require('express'),
    // Server
    server = require('./../../../webserver'),
    URL = server.serverUrl,
    // REST-API-Router
    api = require('./../rest-api'),
    // Database Access (salesforce REST-API)
    db = require('./../database/salesforce/database');
    // Express.js Application
    app = module.exports = express();

// ---------------- API --------------------------------------------------------

var OPERATION = '/status';

// ---------------- Operations --------------------------------------------

var requestBars = function (req, res, next) {
  db.getBars(req, res, next);
};

var requestBar = function (req, res, next) {
  db.getBar(req, res, next);
};

var requestToken = function (req, res, next) {
  db.getTokenByBar(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

 /*
  * ## List all receivers
  */
 app.get('/', [requestBars], function(req, res) {
  res.json(req.response);
 });

 /*
  * ## Get bar by label
  */
 app.get('/:label', [requestBar, requestToken], function(req, res) {
  res.json(req.response);
 });
