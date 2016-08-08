var nforce = require('nforce');

var GET_ALL = 'SELECT Id, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c';
var GET_BY_ID = 'SELECT Id, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE Id = \'[:id]\'';

var GET_ALL_BY_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE DAY_ONLY(datetime__c) = [:date] ORDER BY datetime__c';
var GET_ALL_BY_START_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE DAY_ONLY(datetime__c) >= [:start] ORDER BY datetime__c';
var GET_ALL_BY_END_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE DAY_ONLY(datetime__c) <= [:end] ORDER BY datetime__c';
var GET_ALL_BY_START_END_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE DAY_ONLY(datetime__c) >= [:start] AND DAY_ONLY(datetime__c) <= [:end] ORDER BY datetime__c';

var GET_ALL_BY_APP = 'SELECT Id, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c = \'[:id]\'';
var GET_ALL_BY_APP_AND_BY_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c = \'[:id]\' AND DAY_ONLY(datetime__c) = [:date] ORDER BY datetime__c';
var GET_ALL_BY_APP_AND_BY_START_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c = \'[:id]\' AND DAY_ONLY(datetime__c) >= [:start] ORDER BY datetime__c';
var GET_ALL_BY_APP_AND_BY_END_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c = \'[:id]\' AND DAY_ONLY(datetime__c) <= [:end] ORDER BY datetime__c';
var GET_ALL_BY_APP_AND_BY_START_END_DATE = 'SELECT Id, Name, CreatedDate, LastModifiedDate, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c = \'[:id]\' AND DAY_ONLY(datetime__c) >= [:start] AND DAY_ONLY(datetime__c) <= [:end] ORDER BY datetime__c';

var GET_ALL_BY_SMARTPHONE = 'SELECT Id, CreatedDate, Name, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c IN (SELECT Id FROM App__c WHERE smartphone__c = \'[:id]\')';
var GET_ALL_BY_SMARTPHONE_AND_BY_DATE = 'SELECT Id, CreatedDate, Name, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c IN (SELECT Id FROM App__c WHERE smartphone__c = \'[:id]\') AND DAY_ONLY(datetime__c) = [:date] ORDER BY datetime__c';
var GET_ALL_BY_SMARTPHONE_AND_BY_START_DATE = 'SELECT Id, CreatedDate, Name, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c IN (SELECT Id FROM App__c WHERE smartphone__c = \'[:id]\') AND DAY_ONLY(datetime__c) >= [:start] ORDER BY datetime__c';
var GET_ALL_BY_SMARTPHONE_AND_BY_END_DATE = 'SELECT Id, CreatedDate, Name, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c IN (SELECT Id FROM App__c WHERE smartphone__c = \'[:id]\') AND DAY_ONLY(datetime__c) <= [:end] ORDER BY datetime__c';
var GET_ALL_BY_SMARTPHONE_AND_BY_START_END_DATE = 'SELECT Id, CreatedDate, Name, text__c, datetime__c, title__c, priority__c, contact__c, app__c FROM Notification__c WHERE app__c IN (SELECT Id FROM App__c WHERE smartphone__c = \'[:id]\')AND DAY_ONLY(datetime__c) >= [:start] AND DAY_ONLY(datetime__c) <= [:end] ORDER BY datetime__c';

module.exports = {

  getNotifications : function(req, res, org, oauth, next) {

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

  getNotificationsByApp : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = req.params.id; // App ID

        console.log(">> GET Notifications BY APP ID: "+ obj);

        var query = GET_ALL_BY_APP;

        if (typeof req.query.date != 'undefined') { // &date=2016-06-01

          query = GET_ALL_BY_APP_AND_BY_DATE.replace("[:date]", req.query.date);

        } else if (typeof req.query.start != 'undefined') {
          if (typeof req.query.end != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_APP_AND_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &start=2016-06-01

            query = GET_ALL_BY_APP_AND_BY_START_DATE.replace("[:start]", req.query.start);

          }
        } else if (typeof req.query.end != 'undefined') {
          if (typeof req.query.start != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_APP_AND_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &end=2016-06-30

            query = GET_ALL_BY_APP_AND_BY_END_DATE.replace("[:end]", req.query.end);

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

  getNotificationsBySmartphoneApp : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = req.params.app; // App ID

        console.log(">> GET Notifications BY APP ID: "+ obj);

        var query = GET_ALL_BY_APP;

        if (typeof req.query.date != 'undefined') { // &date=2016-06-01

          query = GET_ALL_BY_APP_AND_BY_DATE.replace("[:date]", req.query.date);

        } else if (typeof req.query.start != 'undefined') {
          if (typeof req.query.end != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_APP_AND_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &start=2016-06-01

            query = GET_ALL_BY_APP_AND_BY_START_DATE.replace("[:start]", req.query.start);

          }
        } else if (typeof req.query.end != 'undefined') {
          if (typeof req.query.start != 'undefined') { // &start=2016-06-01&end=2016-06-30

            query = GET_ALL_BY_APP_AND_BY_START_END_DATE.replace("[:start]", req.query.start).replace("[:end]", req.query.end);

          } else { // &end=2016-06-30

            query = GET_ALL_BY_APP_AND_BY_END_DATE.replace("[:end]", req.query.end);

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

  getNotificationsBySmartphone: function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = req.params.id; // Smartphone ID

        console.log(">> GET Notifications BY SMARTPHONE ID: "+ obj);

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

        query = query.replace("[:id]", obj);
        console.log("QUERY: "+query);

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
            console.log('>> DB REQUEST');
            console.log('QUERY: '+ query);
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


  getNotification : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.id;

    console.log(">> GET Notification BY ID: "+ obj);

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

  getNotificationByApp : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.notification; // /apps/{id}/notifications/{notification} <- ID

    console.log(">> GET Notification BY ID: "+ obj);

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

  insertNotification : function(req, res, org, oauth, next) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var obj = nforce.createSObject('Notification__c');
        obj.set('text__c', req.body.text__c);
        obj.set('title__c', req.body.title__c);
        obj.set('datetime__c', req.body.datetime__c);
        obj.set('contact__c', req.body.contact__c);
        obj.set('priority__c', req.body.priority__c);
        obj.set('app__c', req.body.app__c);

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

                res.json(result);
              }
            });

          }
        });
  },

  updateNotification : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.id;

    console.log(">> UPDATE Notification BY LABEL: "+ obj);

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
          obj.set('text__c', req.body.text__c);
          obj.set('title__c', req.body.title__c);
          obj.set('datetime__c', req.body.datetime__c);
          obj.set('contact__c', req.body.contact__c);
          obj.set('priority__c', req.body.priority__c);
          obj.set('app__c', req.body.app__c);

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

  deleteNotification : function(req, res, org, oauth, next) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var obj = req.params.id;

    console.log(">> DELETE Notification BY ID: "+ obj);

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
