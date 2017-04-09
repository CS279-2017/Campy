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
    rest            = require('../rest/rest'),
    ObjectId        = mongoose.Schema.ObjectId,
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    cookieParser    = require('cookie-parser'),
    bcrypt          = require('bcrypt'),
    MongoStore      = require('connect-mongo')(session),
    AWS             = require('aws-sdk'),
    multer          = require('multer'),
    multerS3        = require('multer-s3'),
    flash           = require ('connect-flash'),
    imager          = require('multer-imager');

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
mongoose.Promise = global.Promise;
mongoose.connect(connection_string);
let db = mongoose.connection;

var s3 = new AWS.S3();
var upload = multer({
  storage: imager({
    dirname:"images", //imager makes you have a dirname
    bucket: bucketname,
    accessKeyId: s3.config.credentials.accessKeyId,
    secretAccessKey: s3.config.credentials.secretAccessKey,
    region: 'us-east-1',
    acl: 'public-read',
    gm: {                                 // [Optional]: define graphicsmagick options
      width: 200,                         // doc: http://aheckmann.github.io/gm/docs.html#resize      
      options: '!',                       // Default: jpg
      format: 'jpg'
    },
    
        
    s3 : {                                // [Optional]: define s3 options
        ACL:'public-read',
        Metadata: {                         // http://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPUT.html
          'customkey': 'data'               // "x-amz-meta-customkey","value":"data"
        }
    },
    
    filename: function (req, file, cb) {  // [Optional]: define filename (default: random)
      cb(null, file.originalname)         // i.e. with a timestamp
    },                                    //
    // key: function (req, file, cb) {
    //   cb(null, file.originalname)
    // }
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
        //check password
        var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
        if(!passwordRegex.test(data.password)){
            res.status(400).send({error: 'Password must be 6 characters long, contain one uppercase, one lowercase, and one number'});
            return;
        }

        User.createUser(data, function(err) {
            if (err) {
                res.status(400).send({error: 'User already exists in the database'});
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


//Returns the rating array for a campsite and whether or not the user has already rated this campsite
//so it can be blocked on clientside.
//TS
app.get('/v1/rate',loggedIn, function(req, res) {
    let siteId = req.query.campsiteid;
    Campsite.findOne({_id: siteId}, function (err, site) {
        //if error
        if(err){
            res.send(400, "Campsite not found.");
        }
        //else find user
        User.getUserByUsername(req.user.username, function(err, user){
            //shouldn't ever get this error.
            if(err){res.send(401, "User doesn't exist.");}
            
            let data = {
                rating:site.rating,
                voted:false
            }

            //check user vote
            if(user.votedReviews.indexOf(siteId) != -1){
                //toggle voted
                data.voted = true;
                res.send(data);
            }else{
                //user hasn't voted yet.
                res.send(data);
            }
        });

    } );
});

//rates a campsite and pushes it into user array of voted campsites
//TS
app.post('/v1/rate',loggedIn, function(req, res) {
    let siteId = req.body.campsiteid;
    User.getUserByUsername(req.user.username, function(err, user){
        if(err){res.send(401, "User doesn't exist.");}
        
        if(user.votedReviews.indexOf(siteId) != -1){
            res.send(401, "User has already voted");
        }else{
            Campsite.findOneAndUpdate({ _id: siteId }, { $push: {rating: parseInt(req.body.rating)} }, function(err, campsite) {
                if (err) res.send(500, 'Failed to update campsite');
                user.votedReviews.push(siteId);
                user.save(function(err){
                    if(err){
                        console.log(err);
                    }
                });
                res.send(200);
            });  
        }
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
            if(err.code == 11000 ){
                res.send(400, {error:"Campsite name is taken, please name something else."});
            }else{
                res.send(500, {error:"Campsite could not be created. Try again later."});
            }
            return;
        }
        console.log('Added new site: ');
        console.log(newsite);
        res.send(newsite);
    });
});

app.get('/v1/profileimg', function(req, res){
    if(req.user){
        User.getProfilePicByUsername(req.user.username, function(cb){
            if(cb.error){
                console.log(cb.error);
                res.status(500).send();
            }else if(cb.profilePicture != null){
                res.send(cb);
            }else{
                console.log(cb);
                res.status(500).send();
            }
        });

    }else{
        res.status(500).send();
    }
});

app.post('/v1/campsiteimage', upload.single('images'), function(req,res){
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
// Provides all campsites in a response to the client.
app.get('/v1/campsites/window', loggedIn, function(req, res) {    
    console.log('GET campsites request made');
    console.log("");

    let thewindow = req.query;
    let cb = function(data){
        if(!data){
            res.send(500, "An error occurred");
        }else{
            res.json(data);
        }   
    }
    let sites = Campsite.getCampsitesByWindow(thewindow, cb);
  
    
});

app.get('/v1/place', loggedIn, function(req, res){
    
    console.log(req.query.query);

    let path = encodeURI("/maps/api/place/textsearch/json?query="+req.query.query+"&key=AIzaSyAUimB4-PZ_y2N96diVv7i95xPIsayoF3E");
    
    let options = {
    host: 'maps.googleapis.com',
    port: 443,
    path: path,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }};

    rest.getJSON(options, function(statusCode, result){
        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
        res.statusCode = statusCode;
        res.send(result);
    });

});

//returns reviews and if user has voted.
app.get('/v1/reviews', loggedIn, function(req, res){
    let siteid = req.query.campsiteid;
    console.log("id");
    console.log(siteid);

    Review.getReviewsByCampsiteId(siteid, function(err, data){
        let revData = {userReviewed:false, reviews:[]};
        if(err){
            console.log(err);
            res.status(500).send("An error occurred");
        }
        if(!data){
            res.send(revData);
        }else{
            revData.reviews = data;
            if(req.user){

                data.forEach(function(item){
                    if(item.creator == req.user.username){
                        revData.userReviewed = true;
                    }
                })
            }
            res.send(revData);
        }
    })
});
app.post('/v1/review', loggedIn, function(req, res){
    let data = req.body;
    let siteId = data.campsite;
    console.log("data");
    console.log(data);
    User.getUserByUsername(req.user.username, function(err, user){
        if(err){console.log("Trigger1");res.send(401, "User doesn't exist.");}
        
        if(user.votedReviews.indexOf(siteId) != -1){
            console.log("Trigger2");
            res.send(401, "User has already voted");
        }else{
            Campsite.findOneAndUpdate({ _id: siteId }, { $push: {rating: parseInt(data.rating)} }, function(err, campsite) {
                if (err) res.send(500, 'Failed to update campsite');
                user.votedReviews.push(siteId);
                user.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).send();

                    }
                });
            });  

            data.user = user.username;
            Review.addReview(data, function(cb){
                if(cb){
                    console.log("Error:" + cb);
                    res.status(500).send();
                }
            });
            res.status(200).send();
        }
    });

});

let server = app.listen(listeningport, function () {
    console.log('Campy listening on ' + listeningport);
});