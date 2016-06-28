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

var OPERATION = '/notifications';

// ---------------- Operations --------------------------------------------

var requestNotifications = function (req, res, next) {
  db.getNotifications(req, res, next);
};

var requestNotification = function (req, res, next) {
  db.getNotification(req, res, next);
};

var insertNotification = function (req, res, next) {
    db.insertNotification(req, res, next);
};

var updateNotification = function (req, res, next) {
    db.updateNotification(req, res, next);
};

var deleteNotification = function (req, res, next) {
    db.deleteNotification(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestNotifications], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Notification
 */
app.post('/', [insertNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Notification by id
 */
app.get('/:id', [requestNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Notification by id
 */
app.put('/:id', [updateNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Notification by id
 */
app.delete('/:id', [deleteNotification], function(req, res) {
  res.json(req.response);
});
