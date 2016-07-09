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
    sides         = require('./side'),
    tokens        = require('./token'),
    devices       = require('./device'),
    smartphones   = require('./smartphone'),
    apps          = require('./app'),
    notifications = require('./notification'),
    invocations   = require('./invocation');
    activations   = require('./activation');


module.exports = {
  // --- Bars ------------------------------------------------------------------
  getBars : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.getBars(req, res, org, oauth, next);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getBarsByDevice : function(device, callback) {
    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.getBarsByDevice(device, callback, org, oauth);                       // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getBar : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.getBar(req, res, org, oauth, next);                                // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertBar : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.insertBar(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateBar : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.updateBar(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteBar : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        bars.deleteBar(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Side ------------------------------------------------------------------
  getSides : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.getSides(req, res, org, oauth, next);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getSide : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.getSide(req, res, org, oauth, next);                                // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getSideByLabel : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.getSideByLabel(req, res, org, oauth, next);                                // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getSidesByBar : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.getSidesByBar(req, res, org, oauth, next);                                // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertSide : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.insertSide(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateSide : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.updateSide(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateSideByBar : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.updateSideByBar(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteSide : function (req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        sides.deleteSide(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Animations ------------------------------------------------------------
  getAnimations : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.getAnimations(req, res, org, oauth, next);                   // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getAnimation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.getAnimation(req, res, org, oauth, next);                    // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertAnimation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.insertAnimation(req, res, org, oauth, next);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateAnimation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.updateAnimation(req, res, org, oauth, next);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteAnimation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        animations.deleteAnimation(req, res, org, oauth, next);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Tokens ----------------------------------------------------------------
  getTokens : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.getTokens(req, res, org, oauth, next);                           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getToken : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.getToken(req, res, org, oauth, next);                           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getTokenByBar : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.getTokenByBar(req, res, org, oauth, next);                           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertToken : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.insertToken(req, res, org, oauth, next);                         // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateToken : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.updateToken(req, res, org, oauth, next);                         // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteToken : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        tokens.deleteToken(req, res, org, oauth, next);                         // <--
      } else { console.log('Error: ' + err.message); }
    });
  },

  // ===========================================================================

  // --- Devices ---------------------------------------------------------------
  getDevices : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        devices.getDevices(req, res, org, oauth, next);                         // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getDevice : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        devices.getDevice(req, res, org, oauth, next);                         // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertDevice : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        devices.insertDevice(req, res, org, oauth, next);                       // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateDevice : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        devices.updateDevice(req, res, org, oauth, next);                       // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteDevice : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        devices.deleteDevice(req, res, org, oauth, next);                       // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Smartphones -----------------------------------------------------------
  getSmartphones : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        smartphones.getSmartphones(req, res, org, oauth, next);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getSmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        smartphones.getSmartphone(req, res, org, oauth, next);                  // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertSmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        smartphones.insertSmartphone(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateSmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        smartphones.updateSmartphone(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteSmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        smartphones.deleteSmartphone(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Apps ------------------------------------------------------------------
  getApps : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.getApps(req, res, org, oauth, next);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getAppsBySmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.getAppsBySmartphone(req, res, org, oauth, next);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.getApp(req, res, org, oauth, next);                                // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getAppBySmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.getAppBySmartphone(req, res, org, oauth, next);                               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.insertApp(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.updateApp(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        apps.deleteApp(req, res, org, oauth, next);                             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Notifications ---------------------------------------------------------
  getNotifications : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.getNotifications(req, res, org, oauth, next);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getNotificationsByApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.getNotificationsByApp(req, res, org, oauth, next);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getNotificationsBySmartphoneApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.getNotificationsBySmartphoneApp(req, res, org, oauth, next);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getNotification : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.getNotification(req, res, org, oauth, next);              // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getNotificationByApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.getNotificationByApp(req, res, org, oauth, next);              // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertNotification : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.insertNotification(req, res, org, oauth, next);           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateNotification : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.updateNotification(req, res, org, oauth, next);           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteNotification : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        notifications.deleteNotification(req, res, org, oauth, next);           // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Invocations -----------------------------------------------------------
  getInvocations : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.getInvocations(req, res, org, oauth, next);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getInvocationsByApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.getInvocationsByApp(req, res, org, oauth, next);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getInvocationsBySmartphoneApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.getInvocationsBySmartphoneApp(req, res, org, oauth, next);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getInvocation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.getInvocation(req, res, org, oauth, next);                  // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getInvocationByApp : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.getInvocationByApp(req, res, org, oauth, next);                  // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertInvocation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.insertInvocation(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateInvocation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.updateInvocation(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteInvocation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        invocations.deleteInvocation(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // --- Activations -----------------------------------------------------------
  getActivations : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.getActivations(req, res, org, oauth, next);                 // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getActivationsBySmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.getActivationsBySmartphone(req, res, org, oauth, next);             // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getActivation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.getActivation(req, res, org, oauth, next);                  // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  getActivationBySmartphone : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.getActivationBySmartphone(req, res, org, oauth, next);                  // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  insertActivation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.insertActivation(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  updateActivation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.updateActivation(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  deleteActivation : function(req, res, next) {

    org.authenticate(CREDENTIALS, function(err, resp) {
      if(!err) { oauth = resp;
        activations.deleteActivation(req, res, org, oauth, next);               // <--
      } else { console.log('Error: ' + err.message); }
    });
  },
  // ---------------------------------------------------------------------------


};
