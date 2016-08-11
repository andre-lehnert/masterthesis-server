var nforce = require('nforce');

var GET_ALL = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id FROM Token__c';
var GET_BY_ID = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id FROM Token__c WHERE Id = \'[:id]\'';
var GET_BY_LABEL = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id  FROM Token__c WHERE label__c = [:label]';
var GET_BY_APP = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id  FROM Token__c WHERE app__c = \'[:app]\'';
var GET_ALL_INACTIVE = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id FROM Token__c WHERE Id NOT IN (SELECT token__c FROM Bar__c)';
var GET_ALL_ACTIVE = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id FROM Token__c WHERE Id IN (SELECT token__c FROM Bar__c)';

var GET_ALL_ACTIVE_BY_APP = 'SELECT label__c, serial__c, app__c, app_color__c, CreatedDate, LastModifiedDate, Id FROM Token__c WHERE app__c = \'[:app]\' AND Id IN (SELECT token__c FROM Bar__c)'

module.exports = {

  getTokens : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var query = GET_ALL;

        if (req.query.state == 'unbound') {
          query = GET_BY_APP.replace("[:app]", "null");
        } else if (req.query.state == 'inactive') {
          query = GET_ALL_INACTIVE;
        } else if (req.query.state == 'active') {
          query = GET_ALL_ACTIVE;
        }

        org.query({ query: query, oauth: oauth }, function(err, results){
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
            //console.log('>> DB REQUEST');
            console.log('QUERY: '+ GET_ALL);
            //console.log('RESPONSE: Entries = '+ results.totalSize);

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

  getTokensByApp : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = req.params.app;

        console.log(">> GET ACTIVE TOKEN BY APP: "+ obj);


        var query = GET_ALL_ACTIVE_BY_APP.replace("[:app]", obj);

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

            req.response = response;
            next();

          } else if(!err) {
            //console.log('>> DB REQUEST');
            console.log('QUERY: '+ query);
            //console.log('RESPONSE: Entries = '+ results.totalSize);

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


  getToken : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.label;

    console.log(">> GET TOKEN BY LABEL: "+ obj);

    var query = GET_BY_LABEL.replace("[:label]", obj);

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

        //console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        //console.log('RESPONSE: Entries = '+ result.totalSize);

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

  getTokenByBar : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.token;

    if (obj == null) {
      var response =
        {
          'href': URL,
          '_success': true,
          'object': {}
        };

        req.response = response;
        next();

    } else {

    console.log(">> GET TOKEN BY ID: "+ obj);

    var query = GET_BY_ID.replace("[:id]", obj);

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

        //console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        //console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // Set Response Object
        if (result.totalSize == 1) { // 1 entry

          var response =
          {
            'href': URL,
            '_success': true,
            'object': result.records[0]
          };

          //console.log(response);

          req.response = response;
          next();

        } else { // no entry // salesforce duplicate check

          var response =
          {
            'href': URL,
            '_success': false,
            '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
          };

          //console.log(response);

          req.response = response;
          next();
        }
      }
    });
   }
  },

    getTokenByDevice : function(req, res, org, oauth, next) {

    var obj = req.token;

    //console.log(">> GET TOKEN BY LABEL: "+ obj);

    var query = GET_BY_LABEL.replace("[:label]", obj);

    org.query({ query: query, oauth: oauth }, function(err, result){
      if (err) {

        console.log('Database Token: '+err);

      } else if(!err) {

        //console.log('>> DB REQUEST');
        //console.log('QUERY: '+ query);
        //console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // Set Response Object
        if (result.totalSize == 1) { // 1 entry

          req.response = result.records[0];
          console.log(req.response);
          next(req, res);

        } else { // no entry // salesforce duplicate check

          console.log('Database Token: No entry found');
        }
      }
    });
  },

  insertToken : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var token = nforce.createSObject('Token__c');
        token.set('label__c', req.body.label__c);
        token.set('serial__c', req.body.serial__c);
        token.set('app__c', req.body.app__c );

        console.log(">> INSERT");
        console.log(token.toJSON());

        org.insert({ sobject: token, oauth: oauth }, function(err, result){

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

  updateToken : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var token = req.params.label;

    console.log(">> UPDATE TOKEN BY LABEL: "+ token);

    var query = GET_BY_LABEL.replace("[:label]", token);

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

          var token = result.records[0];
          token.set('label__c', req.body.label__c);
          token.set('serial__c', req.body.serial__c);
          token.set('app__c', req.body.app__c );

          org.update({ sobject: token, oauth: oauth }, function(err, result) {

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

  deleteToken : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var token = req.params.label;

    console.log(">> DELETE TOKEN BY LABEL: "+ token);

    var query = GET_BY_LABEL.replace("[:label]", token);

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

          var token = result.records[0];

          org.delete({ sobject: token, oauth: oauth }, function(err, result) {

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
