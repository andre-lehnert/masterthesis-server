// ---------------- Operation --------------------------------------------------
var bodyParser = require('body-parser'),
    express = require('express'),
    // Server
    server = require('./../../../server'),
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

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getNotifications(req, res);
});

/*
 * ## Insert new Notification
 */
app.post('/', function(req, res) {
  db.insertNotification(req, res);
});

/*
 * ## Get Notification by id
 */
app.get('/:id', function(req, res) {
  db.getNotification(req, res);
});

/*
 * ## Update an Notification by id
 */
app.put('/:id', function(req, res) {
  db.updateNotification(req, res);
});

/*
 * ## Delete an Notification by id
 */
app.delete('/:id', function(req, res) {
  db.deleteNotification(req, res);
});
