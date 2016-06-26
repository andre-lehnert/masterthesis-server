var nforce = require('nforce');


var GET_ALL = 'SELECT name__c, short_name__c, LastModifiedDate, CreatedDate, Id FROM Animation__c';
var GET_BY_ID = 'SELECT name__c, short_name__c, LastModifiedDate, CreatedDate, Id FROM Animation__c WHERE Id = \'[:id]\'';
var GET_BY_NAME = 'SELECT name__c, short_name__c, LastModifiedDate, CreatedDate, Id FROM Animation__c WHERE name__c = \'[:name]\'';

module.exports = {

  getAnimations : function(req, res, org, oauth) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        org.query({ query: GET_ALL, oauth: oauth }, function(err, results){
          if (err) {
            console.log(err);
            var response =
            {
              'href': URL,
              '_success': false,
              '_errors': err
            };

            res.json(response);

          } else if(!err) {
            console.log('>> DB REQUEST');
            console.log('QUERY: '+ GET_ALL);
            console.log('RESPONSE: Entries = '+ results.totalSize);

            // -----------------------------------------------------------------
            // Set Response Object
            var objs = [];

            for (var r in results.records) {
              objs.push(results.records[r]);
            }

            var response =
            {
              'href': URL,
              '_success': true,
              '_count': results.totalSize,
              'objects': objs
            };

            console.log(response);

            res.json(response);
          }
        });
  },

  getAnimation : function(req, res, org, oauth) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var animation = req.params.name;

    console.log(">> GET ANIMATION BY NAME: "+ animation);

    var query = GET_BY_NAME.replace("[:name]", animation);

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

        res.json(response);

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

          res.json(response);

        } else { // no entry // salesforce duplicate check

          var response =
          {
            'href': URL,
            '_success': false,
            '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
          };

          console.log(response);

          res.json(response);
        }
      }
    });
  },

  insertAnimation : function(req, res, org, oauth) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        var ani = nforce.createSObject('Animation__c');
        ani.set('name__c', req.body.name__c);
        ani.set('short_name__c', req.body.short_name__c);

        console.log(">> INSERT");
        console.log(ani.toJSON());

        org.insert({ sobject: ani, oauth: oauth }, function(err, result){

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

            res.json(response);

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
                res.json(response);

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

  updateAnimation : function(req, res, org, oauth) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var animation = req.params.name;

    console.log(">> GET ANIMATION BY NAME: "+ animation);

    var query = GET_BY_NAME.replace("[:name]", animation);

    org.query({ query: query, oauth: oauth }, function(err, result) {

      if (err) {
        console.log(err);
        var response =
        {
          'href': URL,
          '_success': false,
          '_errors': err
        };
        res.json(response);

      } else if(!err) {

        console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // UPDATE
        if (result.totalSize == 1) { // 1 entry

          var ani = result.records[0];
          ani.set('short_name__c', req.body.short_name__c);

          org.update({ sobject: ani, oauth: oauth }, function(err, result) {

            if (err) {
              console.log(err);
              var response =
              {
                'href': URL,
                '_success': false,
                '_errors': err
              };
              res.json(response);

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
                  res.json(response);

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

                    res.json(response);

                  } else { // no entry // salesforce duplicate check

                    var response =
                    {
                      'href': URL,
                      '_success': false,
                      '_errors': { message: 'No entry found', errorCode: 'NO_ENTRY', statusCode: 204 }
                    };

                    console.log(response);

                    res.json(response);
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
          res.json(response);
        }
      }
    });

  },

  deleteAnimation : function(req, res, org, oauth) {

    var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

    var animation = req.params.name;

    console.log(">> DELETE ANIMATION BY NAME: "+ animation);

    var query = GET_BY_NAME.replace("[:name]", animation);

    org.query({ query: query, oauth: oauth }, function(err, result) {

      if (err) {
        console.log(err);
        var response =
        {
          'href': URL,
          '_success': false,
          '_errors': err
        };
        res.json(response);

      } else if(!err) {

        console.log('>> DB REQUEST');
        console.log('QUERY: '+ query);
        console.log('RESPONSE: Entries = '+ result.totalSize);

        // -----------------------------------------------------------------
        // UPDATE
        if (result.totalSize == 1) { // 1 entry

          var ani = result.records[0];

          org.delete({ sobject: ani, oauth: oauth }, function(err, result) {

            if (err) {
              console.log(err);
              var response =
              {
                'href': URL,
                '_success': false,
                '_errors': err
              };
              res.json(response);

            } else if(!err) {
              console.log('DELETE COMPLETE');
              var response =
              {
                'href': URL,
                '_success': true
              };
              console.log(response);
              res.json(response);
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
          res.json(response);
        }
      }
    });
  }

};
