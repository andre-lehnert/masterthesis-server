var nforce = require('nforce');

var GET_ALL = 'SELECT label__c, calibrated__c, position__c, animation__c, token__c, led__c, motor__c, app__c, color__c, brightness__c, animation_speed__c, side_a__c, side_b__c, side_c__c, side_d__c, device__c, CreatedDate, LastModifiedDate, Id FROM Bar__c';
var GET_BY_ID = 'SELECT label__c, token__c, animation__c, position__c, calibrated__c, led__c, motor__c, app__c, color__c, brightness__c, animation_speed__c, side_a__c, side_b__c, side_c__c, side_d__c, device__c, CreatedDate, LastModifiedDate, Id FROM Bar__c WHERE Id = \'[:id]\'';
var GET_BY_LABEL = 'SELECT label__c, token__c, animation__c, position__c, calibrated__c, led__c, motor__c, app__c, color__c, brightness__c, animation_speed__c, side_a__c, side_b__c, side_c__c, side_d__c, device__c, CreatedDate, LastModifiedDate, Id FROM Bar__c WHERE label__c = \'[:label]\'';
var GET_ALL_BY_DEVICE = 'SELECT label__c, token__c, animation__c, position__c, calibrated__c, led__c, motor__c, app__c, color__c, brightness__c, animation_speed__c, side_a__c, side_b__c, side_c__c, side_d__c, device__c, CreatedDate, LastModifiedDate, Id FROM Bar__c WHERE device__c = \'[:id]\'';


module.exports = {

  getBars : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        org.query({ query: GET_ALL, oauth: oauth }, function(err, results){
          if (err) {

            console.log(err);

            // -----------------------------------------------------------------
            // Set Response Object
            var response =
            {
              'href': URL,
              '_success': false,
              '_errors': err
            };

            req.response = response;
            next();

          } else if(!err) {
            console.log('>> DB REQUEST');
            console.log('QUERY: '+ GET_ALL);
            console.log('RESPONSE: Entries = '+ results.totalSize);

            // -----------------------------------------------------------------
            // Set Response Object
            var receivers = [];

            for (var r in results.records) {
              receivers.push(results.records[r]);
            }

            var response =
            {
              'href': URL,
              '_success': true,
              '_count': results.totalSize,
              'objects': receivers
            };

            console.log(response);

            req.response = response;
            next();
          }
        });
  },

  /*
   * NO EXPRESS METHOD
   */
  getBarsByDevice : function(device, callback, org, oauth) {

    console.log(">> GET BARS BY DEVICE: "+ device);

    var query = GET_ALL_BY_DEVICE.replace("[:id]", device);

    org.query({ query: query, oauth: oauth }, function(err, results) {

          if (err) {

            console.log(err);

            // -----------------------------------------------------------------
            // Set Response Object
            var response =
            {
              'href': URL,
              '_success': false,
              '_errors': err
            };

            callback(response);

          } else if(!err) {
            console.log('>> DB REQUEST');
            console.log('QUERY: '+ GET_ALL);
            console.log('RESPONSE: Entries = '+ results.totalSize);

            // -----------------------------------------------------------------
            // Set Response Object
            var receivers = [];

            for (var r in results.records) {
              receivers.push(results.records[r]._fields);
            }

            console.log(receivers);
            callback(receivers);
          }
        });
  },


  getBar : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var barLabel = req.params.label;

    console.log(">> GET BAR BY LABEL: "+ barLabel);

    var query = GET_BY_LABEL.replace("[:label]", barLabel);

    org.query({ query: query, oauth: oauth }, function(err, result){
      if (err) {

        console.log(err);

        // -----------------------------------------------------------------
        // Set Response Object
        var response =
        {
          'href': URL,
          '_success': false,
          '_errors': err
        };

        req.response = response;
        next();

      } else if(!err) {

        console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // Set Response Object
        if (result.totalSize == 1) { // 1 entry

          var response =
          {
            'href': URL,
            '_success': true,
            'object': result.records[0]
          };

          console.log(response);
          req.ledControl = response.object._fields.led__c;
          req.motorControl = response.object._fields.motor__c;
          req.sideA = response.object._fields.side_a__c;
          req.sideB = response.object._fields.side_b__c;
          req.sideC = response.object._fields.side_c__c;
          req.sideD = response.object._fields.side_d__c;
          req.response = response;
          next();

        } else { // no entry // salesforce duplicate check

          var response =
          {
            'href': URL,
            '_success': false,
            '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
          };

          console.log(response);

          req.response = response;
          next();
        }
      }
    });
  },

  insertBar : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var bar = nforce.createSObject('Bar__c');
        bar.set('label__c', req.body.label__c);
        bar.set('position__c', req.body.position__c);
        bar.set('led__c', req.body.led__c);
        bar.set('motor__c', req.body.motor__c);
        bar.set('calibrated__c', req.body.calibrated__c);
        bar.set('animation__c', req.body.animation__c);
        bar.set('token__c', req.body.token__c);
        bar.set('app__c',  req.body.app__c);
        bar.set('animation_speed__c',  req.body.animation_speed__c);
        bar.set('animation__c',  req.body.animation__c);
        bar.set('color__c',  req.body.color__c);
        bar.set('brightness__c',  req.body.brightness__c);
        bar.set('side_a__c',  req.body.side_a__c);
        bar.set('side_b__c',  req.body.side_b__c);
        bar.set('side_c__c',  req.body.side_c__c);
        bar.set('side_d__c',  req.body.side_d__c);
        bar.set('device__c',  req.body.device__c);

        console.log(">> INSERT");
        console.log(bar.toJSON());

        org.insert({ sobject: bar, oauth: oauth }, function(err, result){

          // -----------------------------------------------------------------
          // on ERROR
          if (err) {

            console.log(err);

            // -----------------------------------------------------------------
            // Set Response Object
            var response =
            {
              'href': URL,
              '_success': false,
              '_errors': err
            };

            req.response = response;
            next();

          // -----------------------------------------------------------------
          // on SUCCESS
          } else if(!err) {

            console.log('INSERT RESULT:');
            console.log(result);

            var response =
            {
              'href': URL,
              '_id': result.id,
              '_success': result.success,
              'object': ''
            };

            // -----
            var query = GET_BY_ID.replace("[:id]", response._id);

            org.query({ query: query, oauth: oauth }, function(err, result){
              if (err) {
                console.log(err);
                var response =
                {
                  'href': URL,
                  '_success': false,
                  '_errors': err
                };
                req.response = response;
                next();

              // -----------------------------------------------------------------
              // on SUCCESS
              } else if(!err) {

                console.log('>> DB REQUEST');
                console.log('QUERY: '+ query);
                console.log('RESPONSE: Entries = '+ result.totalSize);

                // -----------------------------------------------------------------
                // Set Response Object
                var response =
                {
                  'href': URL,
                  '_id': result.records[0]._fields.id,
                  '_success': true,
                  'object': result.records[0]._fields
                };


                console.log(response);
                req.response = response;
                next();
              }
            });

          }
        });
  },

  updateBar : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var barLabel = req.params.label;

    console.log(">> UPDATE BAR BY LABEL: "+ barLabel);

    var query = GET_BY_LABEL.replace("[:label]", barLabel);

    org.query({ query: query, oauth: oauth }, function(err, result) {

      if (err) {
        console.log(err);
        var response =
        {
          'href': URL,
          '_success': false,
          '_errors': err
        };
        req.response = response;
        next();

      } else if(!err) {

        console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // UPDATE
        if (result.totalSize == 1) { // 1 entry

          var bar = result.records[0];
          bar.set('position__c', req.body.position__c);
          bar.set('led__c', req.body.led__c);
          bar.set('motor__c', req.body.motor__c);
          bar.set('calibrated__c', req.body.calibrated__c);
          bar.set('animation__c', req.body.animation__c);
          bar.set('token__c', req.body.token__c);
          bar.set('app__c',  req.body.app__c);
          bar.set('animation_speed__c',  req.body.animation_speed__c);
          bar.set('animation__c',  req.body.animation__c);
          bar.set('color__c',  req.body.color__c);
          bar.set('brightness__c',  req.body.brightness__c);
          bar.set('side_a__c',  req.body.side_a__c);
          bar.set('side_b__c',  req.body.side_b__c);
          bar.set('side_c__c',  req.body.side_c__c);
          bar.set('side_d__c',  req.body.side_d__c);
          bar.set('device__c',  req.body.device__c);

          org.update({ sobject: bar, oauth: oauth }, function(err, result) {

            if (err) {
              console.log(err);
              var response =
              {
                'href': URL,
                '_success': false,
                '_errors': err
              };
              req.response = response;
              next();

            } else if(!err) {

              // -----------------------------------------------------------------
              // REQUEST OBJECT
              org.query({ query: query, oauth: oauth }, function(err, result) {

                if (err) {
                  console.log(err);
                  var response =
                  {
                    'href': URL,
                    '_success': false,
                    '_errors': err
                  };
                  req.response = response;
                  next();

                } else if(!err) {

                  console.log('>> DB REQUEST');
                  console.log('QUERY: '+ query);
                  console.log('RESPONSE: Entries = '+ result.totalSize);

                  // -----------------------------------------------------------------
                  // Set Response Object
                  if (result.totalSize == 1) { // 1 entry

                    var response =
                    {
                      'href': URL,
                      '_success': true,
                      'object': result.records[0]
                    };

                    console.log(response);
                    req.response = response;
                    next();

                  } else { // no entry // salesforce duplicate check

                    var response =
                    {
                      'href': URL,
                      '_success': false,
                      '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
                    };

                    console.log(response);

                    req.response = response;
                    next();
                  }
                }

            });
          }

          });
        } else { // no entry // salesforce duplicate check
          var response =
          {
            'href': URL,
            '_success': false,
            '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
          };
          console.log(response);
          req.response = response;
          next();
        }
      }
    });

  },

  deleteBar : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var barLabel = req.params.label;

    console.log(">> DELETE BAR BY LABEL: "+ barLabel);

    var query = GET_BY_LABEL.replace("[:label]", barLabel);

    org.query({ query: query, oauth: oauth }, function(err, result) {

      if (err) {
        console.log(err);
        var response =
        {
          'href': URL,
          '_success': false,
          '_errors': err
        };
        req.response = response;
        next();

      } else if(!err) {

        console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // UPDATE
        if (result.totalSize == 1) { // 1 entry

          var bar = result.records[0];

          org.delete({ sobject: bar, oauth: oauth }, function(err, result) {

            if (err) {
              console.log(err);
              var response =
              {
                'href': URL,
                '_success': false,
                '_errors': err
              };
              req.response = response;
              next();

            } else if(!err) {
              console.log('DELETE COMPLETE');
              var response =
              {
                'href': URL,
                '_success': true
              };
              console.log(response);
              req.response = response;
              next();
            }
          });

        } else {
          var response =
          {
            'href': URL,
            '_success': false,
            '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
          };
          console.log(response);
          req.response = response;
          next();
        }
      }
    });
  }

};
