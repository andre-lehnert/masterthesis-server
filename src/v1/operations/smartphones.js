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


var requestApps = function (req, res, next) {
  db.getAppsBySmartphone(req, res, next);
};

var requestApp = function (req, res, next) {
  db.getAppBySmartphone(req, res, next);
};


var requestNotifications = function (req, res, next) {
  db.getNotificationsBySmartphoneApp(req, res, next);
};

var requestInvocations = function (req, res, next) {
  db.getInvocationsBySmartphoneApp(req, res, next);
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
 * ## Get Smartphone Apps by id
 */
app.get('/:id/apps', [requestApps], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone App by App id
 */
app.get('/:id/apps/:app', [requestApp], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone Notifications by App id
 */
app.get('/:id/apps/:app/notifications', [requestNotifications], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone Notification by App id
 */
app.get('/:id/apps/:app/notifications/:notification', [requestNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Notification
 */
app.post('/:id/apps/:app/notifications', [insertNotification], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone invocations by App id
 */
app.get('/:id/apps/:app/invocations', [requestInvocations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Smartphone invocation by App id
 */
app.get('/:id/apps/:app/invocations/:invocation', [requestInvocation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Invocation
 */
app.post('/:id/apps/:app/invocations', [insertInvocation], function(req, res) {
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
