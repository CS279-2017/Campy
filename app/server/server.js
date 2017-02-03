'use strict';

let express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('lodash'),
    session         = require('express-session'),
    mongoose        = require('mongoose'),
    path            = require('path'),

app = express();
app.set('views', './views')
app.use(logger('combined'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
const saltRounds = 10;


let port = "32776"
let vunetID = "strayhwt"
let ip = "192.168.99.100"
let db = mongoose.connection;

mongoose.connect('mongodb://'+ip+':'+port+"/"+vunetID);



var sess = {
  secret: 'keyboard cat',
  cookie: {},
  maxage:2592000000
}
app.use(session(sess))

app.use(express.static(path.join(__dirname, '../public/')));

//index
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

// Handle POST to create a user session
app.post('/v1/session', function(req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).send({ error: 'username and password required' });
    } else {

        let data = req.body;
        User.findOne({username: data.username}, function(err, user){
            if(!err){
                let badPassword = true;
                let salt = user.salt;
                let pass = bcrypt.hashSync(req.body.password, salt);
                let hash = user.password;
                if(pass === hash){
                    console.log(pass);
                    badPassword = false;
                }
                if (!user || badPassword) {
                    if (user) console.log('It the password: ' + user.password + ' vs. ' + req.body.password);
                    else console.log('No user found: ' + req.body.username);
                    res.status(401).send({ error: 'unauthorized' });
                } else {

                    res.status(201).send({
                        username:       user.username,
                        primary_email:  user.primary_email
                    });
                }
            }
        });

    }
});


let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});