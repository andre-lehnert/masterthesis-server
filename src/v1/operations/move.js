// ---------------- Operation ---------------------------------------------

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

// ---------------- API ---------------------------------------------------

var OPERATION = '/move';

// ---------------- Routing -----------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {

  db.getBars(req, res);

});

app.get('/:receiver', function(req, res) {
    res.json(
      {
        'receiver' : req.params.receiver
      }
    );
});

app.get('/:receiver/:position', function(req, res) {
    res.json(
      {
        'receiver' : req.params.receiver,
        'position' : req.params.position
      }
    );
});
