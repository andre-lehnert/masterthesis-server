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

    i2c = require('./../i2c/i2c-controller');
    // Express.js Application
    app = module.exports = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies


// ---------------- Start ------------------------------------------------------



// ---------------- API --------------------------------------------------------

var OPERATION = '/bars';

// ---------------- Operations --------------------------------------------

var requestBars = function (req, res, next) {
  db.getBars(req, res, next);
};

var requestBar = function (req, res, next) {
  db.getBar(req, res, next);
};

var requestSide = function (req, res, next) {
  db.getSideByLabel(req, res, next);
};

var requestAllSides = function (req, res, next) {
  db.getSidesByBar(req, res, next);
};

var sendSideI2CRequest = function (req, res, next) {

  var id, receiver, side, operation, lednumber, color, brightness;

  if (req.response._success) {


    if (req.ledControl) {

      operation = req.params.operation;
      lednumber = req.params.led;

      if (operation.toLowerCase() != 'new' &&
          typeof lednumber == 'undefined') {

         res.json(
         {
           "leds" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
         });
	 next();

      } else if (operation.toLowerCase() == 'new') {
        lednumber = 0;
      }

      receiver = req.ledControl;
      id = req.response.object._fields.id;
      operation = req.params.operation;
      side = req.selectedSide;

       var leds;

      if (operation.toLowerCase() != 'new')
        leds = Array(11); //[ null,  null,  null,  null,  null,  null,  null,  null,  null,  null,  null ];
      else
        leds = [ '000000','000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000' ];



      if (!req.params.color)
        color = 'ff0000';
      else
        color = req.params.color;

      if (operation.toLowerCase() === 'remove')
        color = '000000';

      if (!req.params.brightness)
        brightness = 100;
      else
        brightness = parseInt(req.params.brightness);

      if (operation.toLowerCase() === 'new')
        operation = '*';
      else if (operation.toLowerCase() === 'add')
        operation = '+';
      else if (operation.toLowerCase() === 'remove')
        operation = '-';

      lednumber = parseInt(req.params.led) + 1;

      switch (lednumber) {
        case 1: leds[0] = color; break;
        case 2: leds[1] = color; break;
        case 3: leds[2] = color; break;
        case 4: leds[3] = color; break;
        case 5: leds[4] = color; break;
        case 6: leds[5] = color; break;
        case 7: leds[6] = color; break;
        case 8: leds[7] = color; break;
        case 9: leds[8] = color; break;
        case 10: leds[9] = color; break;
        case 11: leds[10] = color; break;
        default: break;
      }


      console.log('>> SEND I2C REQUEST: '+receiver+', '+operation+', '+lednumber+', '+color+', '+brightness);

      req.receiver = receiver;
        req.operation = operation;
        req.lednumber = lednumber;
        req.color =  color;
        req.brightness = brightness;
        req.side = side;
        req.leds = leds;
        i2c.light(req, res, next);


      //i2c.light(receiver, side, operation, lednumber, color, brightness);
      req.body =
        {
          "led_0__c": leds[0],
          "led_1__c": leds[1],
          "led_2__c": leds[2],
          "led_3__c": leds[3],
          "led_4__c": leds[4],
          "led_5__c": leds[5],
          "led_6__c": leds[6],
          "led_7__c": leds[7],
          "led_8__c": leds[8],
          "led_9__c": leds[9],
          "led_10__c": leds[10],
          "label__c": side
        };
      req.sideId = id;
      console.log('ID: '+req.sideId );

    } else {
      res.send('ERROR: sendI2CRequest(): No LED Controller');
    }
  } else {
    res.send('ERROR: sendI2CRequest(): No Side Found');
  }

};

var sendFullBarUpdateI2CRequest = function (req, res, next) {

  console.log('>> Quick I2C: '+req.body);

  req.source = req.body.sideJson;
  req.sidePointer = 0;

  i2c.lightAll(req, res, next);

};

var updateBarSide = function (req, res, next) {

  var _body = {};

    console.log("Side Pointer: "+req.sidePointer+" --> side ID: "+req.source.sideIds[req.sidePointer]);

    req.sideId = req.source.sideIds[req.sidePointer];

    var leds = [];
    for (var i = 0; i < 11; i++) {
      console.log(req.source.sides[i + (req.sidePointer * 11)]);

      leds.push(req.source.sides[i + (req.sidePointer * 11)].color);
    }

    req.body =
        {
          "led_0__c": leds[10],
          "led_1__c": leds[9],
          "led_2__c": leds[8],
          "led_3__c": leds[7],
          "led_4__c": leds[6],
          "led_5__c": leds[5],
          "led_6__c": leds[4],
          "led_7__c": leds[3],
          "led_8__c": leds[2],
          "led_9__c": leds[1],
          "led_10__c": leds[0]
        };


    // Modifiy PUT body
    // switch (req.sidePointer) {
    //     case 0: sideJson["led_"+($scope.barSides[i].led - 1)+"__c"] = rgba2hex($scope.barSides[i].colorA); break;
    //     case 1: sideJson["led_"+($scope.barSides[i].led - 1)+"__c"] = rgba2hex($scope.barSides[i].colorB); break;
    //     case 2: sideJson["led_"+($scope.barSides[i].led - 1)+"__c"] = rgba2hex($scope.barSides[i].colorC); break;
    //     case 3: sideJson["led_"+($scope.barSides[i].led - 1)+"__c"] = rgba2hex($scope.barSides[i].colorD); break;
    //
    //     default:
    //       return; // > 3 abort
    //   }

   req.sidePointer++;

  db.updateSideByBar(req, res, next);
};

var updateBarSides = function (req, res, next) {
  db.updateSideByBar(req, res, next);
};


var sendLevelI2CRequest = function (req, res, next) {

  var id, receiver, lednumber, color, brightness;

  if (req.response._success) {

    if (req.ledControl) {

      lednumber = req.params.led;

      if (typeof req.params.led == 'undefined') {
        lednumber = 1;
      } else {
        lednumber = parseInt(req.params.led) + 1;
      }

      receiver = req.ledControl;
      id = req.response.object._fields.id;

      if (!req.params.color)
        color = 'ff0000';
      else
        color = req.params.color;

      if (!req.params.brightness)
        brightness = 100;
      else
        brightness = parseInt(req.params.brightness);

      console.log('>> SEND I2C REQUEST: '+receiver+', '+lednumber+', '+color+', '+brightness);

      req.receiver = receiver;
        req.lednumber = lednumber;
        req.color =  color;
        req.brightness = brightness;
        i2c.level(req, res, next);

    } else {
      res.send('ERROR: sendI2CRequest(): No LED Controller');
    }
  } else {
    res.send('ERROR: sendI2CRequest(): No Side Found');
  }

};


var updateLevel = function (req, res, next) {
 // db.updateSideByLevel(req, res, next);
next();
};


var insertBar = function (req, res, next) {
    db.insertBar(req, res, next);
};

var updateBar = function (req, res, next) {
    db.updateBar(req, res, next);
};

var deleteBar = function (req, res, next) {
    db.deleteBar(req, res, next);
};



var getAvailableBars = function(req, res, next) {
  if (req.query.state == 'active') {
   console.log('getAvailableBars()');
   i2c.getBars(req, res, next);
  } else
   next();
}


var calibrateBar = function (req, res, next) {
  req.receiver = req.motorControl;
  i2c.calibrateBar(req, res, next);
};



// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestBars, getAvailableBars], function(req, res) {
 res.json(req.response);
});

/*
 * ## Insert new bar
 */
app.post('/', [insertBar], function(req, res) {
 res.json(req.response);
});
/*
 * ## Get bar by label
 */
app.get('/:label', [requestBar], function(req, res) {
 res.json(req.response);
});

app.get('/:label/calibrate', [requestBar, calibrateBar, updateBar], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get bar by label
 */
app.get('/:label/sides', [requestBar, requestAllSides], function(req, res) {
 res.json(req.response);
});
/*
 * ## Get bar and side by label
 */
app.get('/:label/sides/:side', [requestBar, requestSide], function(req, res) {
 res.json(req.response);
});

/*
 * Fast I2C Request
 */
app.put('/:label/sides', [sendFullBarUpdateI2CRequest, updateBarSide, updateBarSide, updateBarSide, updateBarSide], function(req, res) {
  res.json(req.response);
});
app.put('/:label/sides/:side', [sendFullBarUpdateI2CRequest, updateBarSide, updateBarSide, updateBarSide, updateBarSide], function(req, res) {
 res.json(req.response);
});
app.put('/:label/sides/:side/:brightness', [sendFullBarUpdateI2CRequest, updateBarSide, updateBarSide, updateBarSide, updateBarSide], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d)  operation (new, add, remove)
 */
app.get('/:label/sides/:side/:operation', [requestBar, requestSide, sendSideI2CRequest, updateBarSides], function(req, res) {
 res.json(
   {
     "leds" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
   }
  );
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d), operation (new, add, remove), led number (0-10),
 */
app.get('/:label/sides/:side/:operation/:led', [requestBar, requestSide, sendSideI2CRequest, updateBarSides], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d), operation (new, add, remove), led number (0-10), color (ff0000)
 */
app.get('/:label/sides/:side/:operation/:led/:color', [requestBar, requestSide, sendSideI2CRequest, updateBarSides], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), side(a, b, c, d), operation (new, add, remove), led number (0-10), color (ff0000), brightness (0-100)
 */
app.get('/:label/sides/:side/:operation/:led/:color/:brightness', [requestBar, requestSide, sendSideI2CRequest, updateBarSides], function(req, res) {
 res.json(req.response);
});


/*
 * ## Get a bar by label (A1, A2, ...), led number (0-10), color (ff0000)
 */
app.get('/:label/level/:led/:color', [requestBar, sendLevelI2CRequest, updateLevel], function(req, res) {
 res.json(req.response);
});

/*
 * ## Get a bar by label (A1, A2, ...), led number (0-10), color (ff0000), brightness (0-100)
 */
app.get('/:label/level/:led/:color/:brightness', [requestBar, sendLevelI2CRequest, updateLevel], function(req, res) {
 res.json(req.response);
});


/*
 * ## Update a bar by label
 */
app.put('/:label', [updateBar], function(req, res) {
 res.json(req.response);
});

/*
 * ## Delete a bar by label
 */
app.delete('/:label', [deleteBar], function(req, res) {
 res.json(req.response);
});
