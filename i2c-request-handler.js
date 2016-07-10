// ---------------- I²C Request Handler ----------------------------------------
//
//
//
// ---------------- App --------------------------------------------------------
var config = require('./.config').configuration,
    service = require('./src/v1/i2c/intervall-service');

console.log('DEVICE: '+config.DEVICE);


service.start(config.DEVICE, 1000);
