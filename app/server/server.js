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
    bcrypt          = require('bcrypt'),
    MongoStore      = require('connect-mongo')(session),
    AWS             = require('aws-sdk'),
    multer          = require('multer'),
    multerS3        = require('multer-s3'),
    flash           = require ('connect-flash');


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
let bucketname = process.env.BUCKETNAME

let connection_string = 'mongodb://'+user+':'+mongopass+"@"+ip+":"+port+"/"+appname
mongoose.connect(connection_string);
let db = mongoose.connection;

var s3 = new AWS.S3();
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketname,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      console.log(file)
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});

app.use(express.static(path.join(__dirname, '../public/')));
var sess = {
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: db})
}
app.use(session(sess))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

// Flashes can be used on the front end; also can be deleted if needed.
app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success-msg');
    res.locals.error_msg = req.flash('error-msg');
    res.locals.error = req.flash('error');
    next()
})


// Sets up the authentication system for logging users in.
passport.use(new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                console.log('password match');
                return done(null, user);
            } else {
                console.log('incorrect password');
                return done(null, false, {message: 'Incorrect Password'});
            }
        });
    });
}));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

// Put the logged in middleware in the right place to authenticate enpdpoints
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

// Index route
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

// Endpoint used for testing the loggedIn middleware and ensure that
// authentication functions properly
app.get('/v1/ping', function(req, res) {
    if(req.user){
        res.send(JSON.stringify({username: req.user.username, loggedIn : true}));
    }else{
        res.send(JSON.stringify({username: "", loggedIn : false}));
    }
});


// Handles login
app.post('/v1/login', passport.authenticate('local'), function(req, res) { 
    console.log('Successfully logged in ' + req.user.username);
    res.send({success: 'Login successful'});
});

// Handles registration and logs the user in
app.post('/v1/register', function(req, res, next) {
        let data = req.body;

        User.createUser(data, function(err) {
            if (err) {
                res.status(400).send({error: 'user already exists in the database'});
            }
            else {
                let responseString = 'Successfully created user ' + data.username;
                console.log(responseString);
                next()
            }
        })
    },
    passport.authenticate('local'),
    function(req, res) {
        console.log('Logged in after registering.');
        res.send({success: 'Registration successful'});
    });


//TODO
app.get('/v1/rating', function(req, res) {
    let campsiteId = req.body.campsiteid;
    // Campsite.findById({})
});


app.post('/v1/rating', function(req, res) {
    let campsiteName = req.body.campsitename;
    Campsite.update({ name : campsiteName }, { $push: {rating: req.body.rating} }, function(err, campsite) {
        if (err) res.send('Failed to update campsite ' + campsiteName);
        res.send(campsite);
    });
});

app.post('/v1/addsite', function(req, res) {
    let data = req.body;
    // console.log(data);
    // console.log();
    var campsite = new Campsite({
        description: data.description, 
        directions : data.directions,
        fire : data.fire,
        name : data.name,
        rating : [data.rating],
        size : data.size,
        tags : data.tags,
        lat : data.lat,
        long : data.long,
        creator: req.user.username,
        images: data.images
    });
    
    Campsite.create(campsite, function(err, newsite) {
        if (err) {
            console.log('Campsite not properly created.');
            res.send("Failed to upload campsite");
        }
        console.log('Added new site: ');
        console.log(newsite);
        res.send(newsite);
    });
});


app.post('/v1/campsiteimage', upload.single('images'), function(req,res){
    console.log();
    console.log();
    console.log(req.file);
    res.send(req.file.originalname);
});

// Logs a user out, clearing req.user property and clearing the login session if any
app.get('/v1/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Provides all campsites in a response to the client.
app.get('/v1/campsites', loggedIn, function(req, res) {    
    console.log('GET campsites request made')
    Campsite.find({}, function(err, data) {
        res.send(JSON.stringify(data));
    });
});


let server = app.listen(listeningport, function () {
    console.log('Campy listening on ' + listeningport);
});