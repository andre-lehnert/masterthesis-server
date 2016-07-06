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


var requestNotifications = function (req, res, next) {
  db.getNotificationsByApp(req, res, next);
};

var requestInvocations = function (req, res, next) {
  db.getInvocationsByApp(req, res, next);
};


var requestNotification = function (req, res, next) {
  db.getNotificationByApp(req, res, next);
};

var requestInvocation = function (req, res, next) {
  db.getInvocationByApp(req, res, next);
};

var insertNotification = function (req, res, next) {
    db.insertNotification(req, res, next);
};

var insertInvocation = function (req, res, next) {
    db.insertInvocation(req, res, next);
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
 * ## Get notifications
 */
app.get('/:id/notifications', [requestNotifications], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get notifications
 */
app.get('/:id/notifications/:notification', [requestNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Notification
 */
app.post('/:id/notifications', [insertNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get invocations
 */
app.get('/:id/invocations', [requestInvocations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get notifications
 */
app.get('/:id/invocations/:invocation', [requestInvocation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Invocation
 */
app.post('/:id/invocations', [insertInvocation], function(req, res) {
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
