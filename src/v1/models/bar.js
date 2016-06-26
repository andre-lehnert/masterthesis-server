var GET_ALL = 'SELECT Id, Name, CreatedDate, LastModifiedDate, label__c, calibrated__c, position__c, animation__c, token__c, led__c, motor__c, app__c FROM Bar__c';

module.exports = {

  getBars : function(req, res, org, oauth) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        org.query({ query: GET_ALL, oauth: oauth }, function(err, results){
          if(err) throw err;
          else {
            console.log('>> DB REQUEST');
            console.log('QUERY: '+ GET_ALL);
            //console.log('TOKEN: ' + oauth.access_token);
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
              'receivers': receivers
            };

            res.json(response);
          }
        });
  },

  insertBar : function(req, res, org, oauth) {

        var URL =  req.protocol + '://' + req.get('host') + req.originalUrl;

        // SELECT Id,
        // Name,
        // label__c,
        // token__c,
        // animation__c,
        // position__c,
        // calibrated__c,
        // led__c,
        // motor__c,
        // app__c
        // FROM Bar__c

        var bar = nforce.createSObject('Bar__c');
        bar.set('Name', 'Test1');
        bar.set('label__c', 'X1');
        bar.set('position__c', 100);
        bar.set('led__c', '0x91');
        bar.set('motor__c', '0x90');
        bar.set('calibrated__c', true);
        bar.set('animation__c', '');
        bar.set('token__c', '');
        bar.set('app__c', '');

        org.insert({ sobject: bar, oauth: oauth }, function(err, resp){
          if(!err) console.log('It worked!');
          if (err) console.log(err);

          console.log(resp);
        });
  }

};
