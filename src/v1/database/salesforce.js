var nforce = require('nforce');
require('nforce-express')(nforce);

// ---------------------------------------------------------------------------
var org = nforce.createConnection(
  require('./.config').salesforce // load salesforce configuration
);

var oauth;

var CREDENTIALS =
{
  username: org.username,
  password: org.password,
  securityToken: org.securityToken
};

// ---------------------------------------------------------------------------
// Data Access
var bars          = require('./../models/bar-model'),
    animations    = require('./../models/animation-model'),
    tokens        = require('./../models/token-model'),
    apps          = require('./../models/app-model'),
    notifications = require('./../models/notification-model');


module.exports = {
  // ---------------------------------------------------------------------------
  getBars : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.getBars(req, res, org, oauth);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // ---------------------------------------------------------------------------
  getAnimations : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.getAnimations(req, res, org, oauth);                   // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // ---------------------------------------------------------------------------
  getTokens : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.getTokens(req, res, org, oauth);                           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // ---------------------------------------------------------------------------
  getApps : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.getApps(req, res, org, oauth);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // ---------------------------------------------------------------------------
  getNotifications : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.getNotifications(req, res, org, oauth);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  }
  // ---------------------------------------------------------------------------


};
