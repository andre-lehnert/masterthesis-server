var nforce = require('nforce');

var GET_ALL = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c';
var GET_BY_ID = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE Id = \'[:id]\'';

var GET_ALL_BY_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE DAY_ONLY(start__c) = [:date] ORDER BY start__c';
var GET_ALL_BY_START_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE DAY_ONLY(start__c) >= [:start] ORDER BY start__c';
var GET_ALL_BY_END_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE DAY_ONLY(start__c) <= [:end] ORDER BY start__c';
var GET_ALL_BY_START_END_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE DAY_ONLY(start__c) >= [:start] AND DAY_ONLY(start__c) <= [:end] ORDER BY start__c';

var GET_ALL_BY_SMARTPHONE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE smartphone__c = \'[:id]\'';
var GET_ALL_BY_SMARTPHONE_AND_BY_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE smartphone__c = \'[:id]\' AND DAY_ONLY(start__c) = [:date] ORDER BY start__c';
var GET_ALL_BY_SMARTPHONE_AND_BY_START_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE smartphone__c = \'[:id]\' AND DAY_ONLY(start__c) >= [:start] ORDER BY start__c';
var GET_ALL_BY_SMARTPHONE_AND_BY_END_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE smartphone__c = \'[:id]\' AND DAY_ONLY(start__c) <= [:end] ORDER BY start__c';
var GET_ALL_BY_SMARTPHONE_AND_BY_START_END_DATE = 'SELECT Id, CreatedDate, LastModifiedDate, start__c, smartphone__c, total_time__c, end__c FROM Activation__c WHERE smartphone__c = \'[:id]\' AND DAY_ONLY(start__c) >= [:start] AND DAY_ONLY(start__c) <= [:end] ORDER BY start__c';

module.exports = {

  getActivations : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var query = GET_ALL;

        if (typeof req.query.date != 'undefined') { // &date=2016-06-01

          query = GET_ALL_BY_DATE.replace("[:date]", req.query.date);

        } else if (typeof req.query.start != 'undefined') {
          if (typeof req.query.end != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &start=2016-06-01

            query = GET_ALL_BY_START_DATE.replace("[:start]", req.query.start);

          }
        } else if (typeof req.query.end != 'undefined') {
          if (typeof req.query.start != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &end=2016-06-30

            query = GET_ALL_BY_END_DATE.replace("[:end]", req.query.end);

          }

        }

        console.log("QUERY: "+query);

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

  getActivationsBySmartphone : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = req.params.id; // Smartphone ID

        console.log(">> GET activations BY APP ID: "+ obj);

        var query = GET_ALL_BY_SMARTPHONE;

        if (typeof req.query.date != 'undefined') { // &date=2016-06-01

          query = GET_ALL_BY_SMARTPHONE_AND_BY_DATE.replace("[:date]", req.query.date);

        } else if (typeof req.query.start != 'undefined') {
          if (typeof req.query.end != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_SMARTPHONE_AND_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &start=2016-06-01

            query = GET_ALL_BY_SMARTPHONE_AND_BY_START_DATE.replace("[:start]", req.query.start);

          }
        } else if (typeof req.query.end != 'undefined') {
          if (typeof req.query.start != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_SMARTPHONE_AND_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &end=2016-06-30

            query = GET_ALL_BY_SMARTPHONE_AND_BY_END_DATE.replace("[:end]", req.query.end);

          }

        }

        console.log("QUERY: "+query);

        query = query.replace("[:id]", obj);

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

  getActivation : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.id;

    console.log(">> GET Activation BY ID: "+ obj);

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

  getActivationBySmartphone : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.activation; // /apps/{id}/activations/{activation}

    console.log(">> GET Activation BY ID: "+ obj);

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

  insertActivation : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = nforce.createSObject('Activation__c');
        obj.set('start__c', req.body.start__c);
        obj.set('end__c', req.body.end__c);
        obj.set('smartphone__c', req.body.smartphone__c);


        console.log(">> INSERT");
        console.log(obj.toJSON());

        org.insert({ sobject: obj, oauth: oauth }, function(err, result){

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

  updateActivation : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.id;

    console.log(">> UPDATE Activation BY ID: "+ obj);

    var query = GET_BY_ID.replace("[:id]", obj);

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

          var obj = result.records[0];
          obj.set('start__c', req.body.start__c);
          obj.set('end__c', req.body.end__c);
          obj.set('smartphone__c', req.body.smartphone__c);

          org.update({ sobject: obj, oauth: oauth }, function(err, result) {

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

  deleteActivation : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.id;

    console.log(">> DELETE Activation BY ID: "+ obj);

    var query = GET_BY_ID.replace("[:id]", obj);

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

          var obj = result.records[0];

          org.delete({ sobject: obj, oauth: oauth }, function(err, result) {

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
