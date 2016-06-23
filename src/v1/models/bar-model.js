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
  }

};
