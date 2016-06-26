var GET_ALL = '';

module.exports = {

  getNotifications : function(req, res, org, oauth) {

        org.query({ query: GET_ALL, oauth: oauth }, function(err, records){
          if(err) throw err;
          else {
            console.log('>> DB REQUEST');
            console.log('QUERY: '+ GET_ALL);
            //console.log('TOKEN: ' + oauth.access_token);
            console.log('RESPONSE: Entries = '+ records.totalSize);

            // Set Response Object
            res.json(records);

          }
        });
  }

};
