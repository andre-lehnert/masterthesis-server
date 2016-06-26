var GET_ALL = 'SELECT Id, Name, CreatedDate, LastModifiedDate FROM Token__c';

module.exports = {

  getTokens : function(req, res, org, oauth) {

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
            var tokens = [];

            for (var r in results.records) {
              tokens.push(results.records[r]);
            }

            var response =
            {
              'href': URL,
              'tokens': tokens
            };

            res.json(response);
          }
        });
  }

};
