var express = require('express');
var app = module.exports = express();

// ---------------- API --------------------------------------------------------



// shows API information
app.get('/', function(req, res) {
  res.json(
    {
      'echo' : 'HALLO'
    }
  );
});

app.get('/:barchartReceiver', function(req, res) {
    res.json(
      {
        'barchartReceiver' : req.params.barchartReceiver
      }
    );
});

app.get('/:barchartReceiver/:position', function(req, res) {
    res.json(
      {
        'barchartReceiver' : req.params.barchartReceiver,
        'position' : req.params.position
      }
    );
});
