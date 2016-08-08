var nforce = require('nforce');

var GET_ALL = 'SELECT Id, label__c, led_0__c, led_1__c, led_2__c, led_3__c, led_4__c, led_5__c, led_6__c, led_7__c, led_8__c, led_9__c, led_10__c, CreatedDate, LastModifiedDate FROM Side__c';
var GET_BY_ID = 'SELECT Id, label__c, led_0__c, led_1__c, led_2__c, led_3__c, led_4__c, led_5__c, led_6__c, led_7__c, led_8__c, led_9__c, led_10__c, CreatedDate, LastModifiedDate FROM Side__c WHERE Id = \'[:id]\'';
var GET_BY_LABEL = 'SELECT Id, label__c, led_0__c, led_1__c, led_2__c, led_3__c, led_4__c, led_5__c, led_6__c, led_7__c, led_8__c, led_9__c, led_10__c, CreatedDate, LastModifiedDate FROM Side__c WHERE label__c = \'[:label]\'';

module.exports = {

  getSides : function(req, res, org, oauth, next) {

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

  getSide : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var param = req.params.id;

    console.log(">> GET Side BY ID: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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

  getSideByLabel : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var param = req.params.side;

    console.log(">> GET Side BY LABEL: "+ param); // A, B, C or D

    if (param.toLowerCase() === 'a')
      param = req.sideA;
    else if (param.toLowerCase() === 'b')
      param = req.sideB;
    else if (param.toLowerCase() === 'c')
      param = req.sideC;
    else if (param.toLowerCase() === 'd')
      param = req.sideD;
    else {

      console.log(err);

      // -----------------------------------------------------------------
      // Set Response Object
      var response =
      {
        'href': URL,
        '_success': false,
        '_errors': 'Invalid Side [A, B, C, D != ' + param
      };

      req.response = response;
      next();

    }


    console.log(">> GET Side BY ID: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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
          req.selectedSide = response.object._fields.label__c;
          req.sideId = response.object._fields.id;
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

  getSidesByBar : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var param, sides = [];

    console.log(">> GET Side BY BAR"); // A, B, C or D

    param = req.sideA;

    console.log(">> GET Side BY ID: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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

          // A
          sides.push(result.records[0]);

          // B
          param = req.sideB;

          console.log(">> GET Side BY ID: "+ param);

          var query = GET_BY_ID.replace("[:id]", param);

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

                // B
                sides.push(result.records[0]);

                // C
                param = req.sideC;

                console.log(">> GET Side BY ID: "+ param);

                var query = GET_BY_ID.replace("[:id]", param);

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
                      // C
                      sides.push(result.records[0]);

                      // D
                      param = req.sideD;

                      console.log(">> GET Side BY ID: "+ param);

                      var query = GET_BY_ID.replace("[:id]", param);

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

                            // D
                            sides.push(result.records[0]);

                            var response =
                            {
                              'href': URL,
                              '_success': true,
                              '_count': 4,
                              'objects': sides
                            };

                            console.log(response);

                            req.response = response; // <-----------------------
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

  insertSide : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var side = nforce.createSObject('Side__c');
          side.set('label__c', req.body.label__c);
	        side.set('led_0__c', req.body.led_0__c);
          side.set('led_1__c', req.body.led_1__c);
          side.set('led_2__c', req.body.led_2__c);
          side.set('led_3__c', req.body.led_3__c);
          side.set('led_4__c', req.body.led_4__c);
          side.set('led_5__c', req.body.led_5__c);
          side.set('led_6__c', req.body.led_6__c);
          side.set('led_7__c', req.body.led_7__c);
          side.set('led_8__c', req.body.led_8__c);
          side.set('led_9__c', req.body.led_9__c);
          side.set('led_10__c', req.body.led_10__c);

        console.log(">> INSERT");
        console.log(side.toJSON());

        org.insert({ sobject: side, oauth: oauth }, function(err, result){

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

  updateSide : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var param = req.params.id;

    console.log(">> GET Side BY ID: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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

          var side = result.records[0];
          side.set('led_0__c', req.body.led_0__c);
      	  side.set('led_1__c', req.body.led_1__c);
      	  side.set('led_2__c', req.body.led_2__c);
      	  side.set('led_3__c', req.body.led_3__c);
      	  side.set('led_4__c', req.body.led_4__c);
      	  side.set('led_5__c', req.body.led_5__c);
      	  side.set('led_6__c', req.body.led_6__c);
      	  side.set('led_7__c', req.body.led_7__c);
      	  side.set('led_8__c', req.body.led_8__c);
      	  side.set('led_9__c', req.body.led_9__c);
      	  side.set('led_10__c', req.body.led_10__c);

          org.update({ sobject: side, oauth: oauth }, function(err, result) {

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

  updateSideByBar : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    console.log('GET ID: '+req.sideId);
console.log(req.body);
    var param = req.sideId;

    console.log(">> GET Side BY ID: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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

          var side = result.records[0];
          side.set('led_0__c', req.body.led_0__c);
      	  side.set('led_1__c', req.body.led_1__c);
      	  side.set('led_2__c', req.body.led_2__c);
      	  side.set('led_3__c', req.body.led_3__c);
      	  side.set('led_4__c', req.body.led_4__c);
      	  side.set('led_5__c', req.body.led_5__c);
      	  side.set('led_6__c', req.body.led_6__c);
      	  side.set('led_7__c', req.body.led_7__c);
      	  side.set('led_8__c', req.body.led_8__c);
      	  side.set('led_9__c', req.body.led_9__c);
      	  side.set('led_10__c', req.body.led_10__c);

          org.update({ sobject: side, oauth: oauth }, function(err, result) {

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

  updateSideByLevel : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var param = req.sideA;

    console.log(">> GET Side BY LEVEL: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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

          var side = result.records[0];

          switch (req.lednumber) {
            case 1: side.set('led_0__c', req.color); break;
            case 2: side.set('led_1__c', req.color); break;
            case 3: side.set('led_2__c', req.color); break;
            case 4: side.set('led_3__c', req.color); break;
            case 5: side.set('led_4__c', req.color); break;
            case 6: side.set('led_5__c', req.color); break;
            case 7: side.set('led_6__c', req.color); break;
            case 8: side.set('led_7__c', req.color); break;
            case 9: side.set('led_8__c', req.color); break;
            case 10: side.set('led_9__c', req.color); break;
            case 11: side.set('led_10__c', req.color); break;
            default: break;
          }

          org.update({ sobject: side, oauth: oauth }, function(err, result) {

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

                    // <<----

                    param = req.sideB;

                    console.log(">> GET Side BY LEVEL: "+ param);

                    var query = GET_BY_ID.replace("[:id]", param);

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

                          var side = result.records[0];

                          switch (req.lednumber) {
                            case 1: side.set('led_0__c', req.color); break;
                            case 2: side.set('led_1__c', req.color); break;
                            case 3: side.set('led_2__c', req.color); break;
                            case 4: side.set('led_3__c', req.color); break;
                            case 5: side.set('led_4__c', req.color); break;
                            case 6: side.set('led_5__c', req.color); break;
                            case 7: side.set('led_6__c', req.color); break;
                            case 8: side.set('led_7__c', req.color); break;
                            case 9: side.set('led_8__c', req.color); break;
                            case 10: side.set('led_9__c', req.color); break;
                            case 11: side.set('led_10__c', req.color); break;
                            default: break;
                          }

                          org.update({ sobject: side, oauth: oauth }, function(err, result) {

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

                                    // <<----

                                    param = req.sideC;

                                    console.log(">> GET Side BY LEVEL: "+ param);

                                    var query = GET_BY_ID.replace("[:id]", param);

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

                                          var side = result.records[0];

                                          switch (req.lednumber) {
                                            case 1: side.set('led_0__c', req.color); break;
                                            case 2: side.set('led_1__c', req.color); break;
                                            case 3: side.set('led_2__c', req.color); break;
                                            case 4: side.set('led_3__c', req.color); break;
                                            case 5: side.set('led_4__c', req.color); break;
                                            case 6: side.set('led_5__c', req.color); break;
                                            case 7: side.set('led_6__c', req.color); break;
                                            case 8: side.set('led_7__c', req.color); break;
                                            case 9: side.set('led_8__c', req.color); break;
                                            case 10: side.set('led_9__c', req.color); break;
                                            case 11: side.set('led_10__c', req.color); break;
                                            default: break;
                                          }

                                          org.update({ sobject: side, oauth: oauth }, function(err, result) {

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

                                                    // <<----

                                                    param = req.sideD;

                                                    console.log(">> GET Side BY LEVEL: "+ param);

                                                    var query = GET_BY_ID.replace("[:id]", param);

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

                                                          var side = result.records[0];

                                                          switch (req.lednumber) {
                                                            case 1: side.set('led_0__c', req.color); break;
                                                            case 2: side.set('led_1__c', req.color); break;
                                                            case 3: side.set('led_2__c', req.color); break;
                                                            case 4: side.set('led_3__c', req.color); break;
                                                            case 5: side.set('led_4__c', req.color); break;
                                                            case 6: side.set('led_5__c', req.color); break;
                                                            case 7: side.set('led_6__c', req.color); break;
                                                            case 8: side.set('led_7__c', req.color); break;
                                                            case 9: side.set('led_8__c', req.color); break;
                                                            case 10: side.set('led_9__c', req.color); break;
                                                            case 11: side.set('led_10__c', req.color); break;
                                                            default: break;
                                                          }

                                                          org.update({ sobject: side, oauth: oauth }, function(err, result) {

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
                                                                      'object': { 'message': 'Side A, B, C and D updated'}
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

                                                    // <<----

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

                                    // <<----

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

                    // <<----

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

  deleteSide : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var param = req.params.id;

    console.log(">> GET Side BY ID: "+ param);

    var query = GET_BY_ID.replace("[:id]", param);

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

          var side = result.records[0];

          org.delete({ sobject: side, oauth: oauth }, function(err, result) {

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
