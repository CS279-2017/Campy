'use strict';

let express       = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('lodash'),
    session         = require('express-session'),
    mongoose        = require('mongoose'),
    path            = require('path'),
    User            = require('../models/User'),
    Review          = require('../models/Review'),
    Campsite        = require('../models/Campsite'),
    ObjectId        = mongoose.Schema.ObjectId,
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    cookieParser    = require('cookie-parser'),
    bcrypt          = require('bcrypt');

const app = express();
app.set('views', './views')
app.use(logger('combined'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
const saltRounds = 10;

let port = process.env.MONGOPORT
let user = process.env.MONGOUSER
let mongopass = process.env.MONGOPASSWORD
let appname = process.env.APPNAME
let ip = process.env.MONGOIP
let listeningport = 8080

let connection_string = 'mongodb://'+user+':'+mongopass+"@"+ip+":"+port+"/"+appname
mongoose.connect(connection_string);
let db = mongoose.connection;

var sess = {
  secret: 'keyboard cat',
  cookie: {},
  maxage:2592000000
}
app.use(express.static(path.join(__dirname, '../public/')));
app.use(session(sess))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

// TODO: fix some issues with the passport setup.
passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false)}
        return done(null, user)
    });
}));
passport.serializeUser(function(user, done) {
    done(null, user);
})
passport.deserializeUser(function(user, done) {
    User.findById(user._id, function(err, user) {
        done(err, user);
    })
})

// Index route
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

// Handles logins and session creation
app.post('/v1/login', passport.authenticate('local'), function(req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).send({ error: 'username and password required' });
    }
    let data = req.body;

    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.send({error: 'error occurred on login'})
        } else if (bcrypt.compareSync(data.password, user.password)) {
            res.send('Your login using a hashed password was successful!')
        } else {
            res.send('Invalid password')
        }
    })  
})

// Provides all campsites in a response to the client.
app.get('/v1/campsites', function(req, res) {    
    console.log('GET campsites request made')
    Campsite.find({}, function(err, data) {
        res.send(JSON.stringify(data));
    });
});


let server = app.listen(listeningport, function () {
    console.log('Campy listening on ' + listeningport);
});