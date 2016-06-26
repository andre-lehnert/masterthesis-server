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
var bars          = require('./bar'),
    animations    = require('./animation'),
    tokens        = require('./token'),
    apps          = require('./app'),
    notifications = require('./notification');


module.exports = {
  // --- Bars ------------------------------------------------------------------
  getBars : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.getBars(req, res, org, oauth);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getBar : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.getBar(req, res, org, oauth);                                // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertBar : function (req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.insertBar(req, res, org, oauth);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateBar : function (req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.updateBar(req, res, org, oauth);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteBar : function (req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.deleteBar(req, res, org, oauth);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Animations ------------------------------------------------------------
  getAnimations : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.getAnimations(req, res, org, oauth);                   // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getAnimation : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.getAnimation(req, res, org, oauth);                    // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertAnimation : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.insertAnimation(req, res, org, oauth);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateAnimation : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.updateAnimation(req, res, org, oauth);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteAnimation : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.deleteAnimation(req, res, org, oauth);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Tokens ----------------------------------------------------------------
  getTokens : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.getTokens(req, res, org, oauth);                           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertToken : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.insertToken(req, res, org, oauth);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateToken : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.updateToken(req, res, org, oauth);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteToken : function(req, res) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.deleteToken(req, res, org, oauth);                 // <--
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
