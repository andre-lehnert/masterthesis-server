// ---------------- REST Server ------------------------------------------------
//
//
//



// ---------------- URL --------------------------------------------------------
var config = require('./.config').configuration;

// define url and port to concat REST-URLs
var BASEURL     = config.BASEURL,
    PORT        = 8080,
    URL         = BASEURL+':'+PORT;

module.exports.serverUrl = URL;

// ---------------- App --------------------------------------------------------

var express = require('express'),
    path = require('path'),

    // Express.js Application
    app = module.exports = express();

app.use(express.static(path.resolve(__dirname, 'src/v1/ui')));
app.set('_URL', URL);
app.set('_PORT', PORT);


// ---------------- Routing ----------------------------------------------------

/*
 * ## ROOT
 */
app.get('/', function(req, res) {
    res.sendfile(__dirname + 'src/v1/ui/index.html');
})

// ---------------- Run Application --------------------------------------------

var server = app.listen(PORT, function () {
    console.log("Listening on port %s...", server.address().port);
});
