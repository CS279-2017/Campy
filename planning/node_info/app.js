var express = require('express')
var app = express()

app.get('/', function(req, res) {
    res.send('Hello, Campy!');
});

app.get('/v1/campsites', function(req, res) {
    res.send('You accessed the campsites API! Yay!');
});

app.listen(3000, function() {
    console.log('App is running on port 3000.');
})