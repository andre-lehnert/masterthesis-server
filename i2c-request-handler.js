// ---------------- I²C Request Handler ----------------------------------------
//
//
//
// ---------------- App --------------------------------------------------------
var config = require('./.config'),
    service = require('./src/v1/i2c-request-handling/intervall-service'),

service.setAPIVersion(1);       // REST API VERSION
service.setDevice(config.DEVICE);          // /devices/:id to get bars
service.setIntervall(1000);     // I²C checking interval

service.start();
