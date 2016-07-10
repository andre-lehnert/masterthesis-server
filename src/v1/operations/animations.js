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

var OPERATION = '/animations';

// ---------------- Operations --------------------------------------------

var requestAnimations = function (req, res, next) {
  db.getAnimations(req, res, next);
};

var requestAnimation = function (req, res, next) {
  db.getAnimation(req, res, next);
};

var insertAnimation = function (req, res, next) {
    db.insertAnimation(req, res, next);
};

var updateAnimation = function (req, res, next) {
    db.updateAnimation(req, res, next);
};

var deleteAnimation = function (req, res, next) {
    db.deleteAnimation(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestAnimations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new animation
 */
app.post('/', [insertAnimation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get animation by name
 */
app.get('/:id', [requestAnimation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an animation by name
 */
app.put('/:id', [updateAnimation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an animation by name
 */
app.delete('/:id', [deleteAnimation], function(req, res) {
  res.json(req.response);
});
