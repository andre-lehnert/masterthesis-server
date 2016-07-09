var i2c = require('./i2c-communication');

// --- Init ---

// Get cmd line arguments
// 0 : I2C Receiver
// 1 : I2C Command
var args = process.argv.slice(2);

//args.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
//});

// --- Functions ---

var execute = function(target, command) {
  
  if (target == '--help' || target == '-h') {
    
    console.log('SCAN');
    console.log('- Get all available i2c receiver');
    console.log('');
    console.log('STATUS');
    console.log('- Get Token ID');
    console.log('');
    console.log('ANI:[ANIMATION]/[COLOR]/[BRIGHTNESS]/[SPEED]');
    console.log('- ANIMATION');
    console.log('  on (switch-on)');
    console.log('  off (switch-off)');
    console.log('  bli (blink)');
    console.log('  glo (glow)');
    console.log('  up (shift-up)');
    console.log('  dow (shift-down)');
    console.log('  mov (moving-bars)');
    console.log('  com (comet)');
    console.log('  bou (bouncing)');
    console.log('- COLOR');
    console.log('  HEX code, e.g. ff0000');
    console.log('- BRIGHTNESS');
    console.log('  0 - 100 %');
    console.log('- SPEED');
    console.log('  0 - 100 %');
    console.log('');
    console.log('LIGHT:[SIDE]/[OPERATION]/[LED]/[COLOR]/[BRIGHTNESS]');
    console.log('- SIDE');
    console.log('  Side of bar: A, B, C, D');
    console.log('- OPERATION');
    console.log('  * New lighting pattern');
    console.log('  + Add led color');
    console.log('  + Remove led');
    console.log('- LED');
    console.log('  Number of LED: 1 - 11');
    console.log('- COLOR');
    console.log('  HEX code, e.g. ff0000');
    console.log('- BRIGHTNESS');
    console.log('  0 - 100 %');
    console.log('');
    console.log('MOVE:[POSITION]/[STEPMODE]');
    console.log('- POSITION');
    console.log('  Bar position 0 - 100 %');
    console.log('- STEPMODE');
    console.log('  full');
    console.log('  half');
    console.log('  quarter');
    console.log('  eigthth');
    console.log('  sixteenth');

  } else {

    console.log('>> SCAN');
    i2c.scan(target, command, handleArguments);

  }
};

var handleArguments = function(receivers, target, command) {

  var res = {};
  res.done = false;
  res.success = false;
  res.value = -1;

  if (receivers.length === 0) {

    console.log('NO I2C RECEIVER FOUND');

  } else {

    receivers.forEach(function(val, index, array) {
      
      if (parseInt(target) === val) {

        if (command === 'STATUS') {

          console.log('>> REQUEST');
          i2c.request(parseInt(target), res, response);

        } else {
          
          console.log('>> SEND');
          i2c.send(parseInt(target), command, res, response);
          
        }

      }
    });
  }

//  response(res);
};

var response = function(res) {
  if(res.done) {
    if(res.success) {
      if (res.value !== -1) {
        console.log('VALUE: '+res.value);
      } else {
        console.log('SUCCESS');
      }
    } else {
      console.log('TARGET RECEIVER NOT FOUND');
    }
  }
};




// --- Execute ---

execute(args[0], args[1]);
