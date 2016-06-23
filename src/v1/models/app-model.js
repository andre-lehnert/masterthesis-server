var GET_ALL = 'SELECT Id, Name, CreatedDate, LastModifiedDate, Notifications__c FROM App__c';

module.exports = {

  getApps : function(req, res, org, oauth) {

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
            var apps = [];

            for (var r in results.records) {
              apps.push(results.records[r]);
            }

            var response =
            {
              'href': URL,
              'apps': apps
            };

            res.json(response);
          }
        });
  }

};
