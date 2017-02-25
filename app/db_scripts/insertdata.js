let mongoose        = require('mongoose'),
    ObjectId        = mongoose.Types.ObjectId,
    User            = require('../models/User'),
    Review          = require('../models/Review'),
    Campsite        = require('../models/Campsite'),
    bcrypt          = require('bcrypt')

let saltRounds = 10
let port = process.env.MONGOPORT
let user = process.env.MONGOUSER
let mongopass = process.env.MONGOPASSWORD
let appname = process.env.APPNAME
let ip = process.env.MONGOIP

let connection_string = 'mongodb://'+user+':'+mongopass+"@"+ip+":"+port+"/"+appname
mongoose.connect(connection_string);
let db = mongoose.connection;

/**
 Synchronously cleans up all tables to make sure everything is properly handled.
*/
Campsite.remove({}, function(err) {
    if (!err) console.log('Removed campsite collection data');
    Review.remove({}, function(err) {
        if (!err) {
            console.log('Removed review data');
            loadTestData(function() {
                console.log('Loaded all new data')
            });
        }
    });
});
/**
Loads test information into the MongoDB store. PWs are hashed.
*/
function loadTestData(callback) {
    var reviewID = new ObjectId()

    var salt1 = bcrypt.genSaltSync(saltRounds);
    var hash1 = bcrypt.hashSync("password1", salt1);

    var salt2 = bcrypt.genSaltSync(saltRounds);
    var hash2 = bcrypt.hashSync("password2", salt2);

    var salt3 = bcrypt.genSaltSync(saltRounds);
    var hash3 = bcrypt.hashSync("password3", salt3);


    var testUser1 = new User({username: "turnerstrayhorn", password:hash1, salt: salt1, passwordResetToken: "sillyreset", reviews: [reviewID], votedReviews: []})
    var testUser2 = new User({username: "harrisonstall", password:hash2, salt: salt2, passwordResetToken: "sillyreset", reviews: [], votedReviews: [reviewID]})
    var testUser3 = new User({username: "longadams", password:hash3, salt: salt3, passwordResetToken: "sillyreset", reviews: [], votedReviews: [reviewID]})
    // db.collection('users').insert(testUser1);
    // db.collection('users').insert(testUser2);
    // db.collection('users').insert(testUser3);
    
    var testCampsite = new Campsite({creator: "harrisonstall", rating: 5, description: "There are some cool waterfalls. Highly recommend.",
                                    directions: "Hop the boulder", price: 0, lat: 36.142980, long: -86.805682, size: "small", tags: ["waterfall", "fun"],
                                    fire: true, reviews: [reviewID]});

    var testCampsite2 = new Campsite({creator: "turnerstrayhorn", rating: 5, description: "Great hiking trails! And great hot chicken!",
                                    directions: "Call ahead to skip the line", price: 15, lat: 36.1514, long: -86.7966, size: "medium", tags: ["wheelchair-accessible", "bathrooms"],
                                    fire: true, reviews: []});

    var testCampsite3 = new Campsite({creator: "turnerstrayhorn", rating: 4, description: "Good southern camping!",
                                    directions: "Family style", price: 20, lat: 36.1151, long: -86.6901, size: "large", tags: ["wheelchair-accessible", "bathrooms"],
                                    fire: false, reviews: []});

    var testCampsite4 = new Campsite({creator: "turnerstrayhorn", name: "somesite", rating: 4, description: "Testsite",
                                    directions: "tbd", price: 20, lat: 36.1351, long: -86.7901, size: "large", tags: ["pet-friendly", "family-friendly"],
                                    fire: false, reviews: []});

    var testCampsite5 = new Campsite({creator: "harrisonstall", name: "someothersite", rating: 4, description: "Testsite",
                                    directions: "tbd", price: 20, lat: 36.2151, long: -86.4901, size: "large", tags: ["family-friendly", "wheelchair-accessible"],
                                    fire: false, reviews: []});

    var testCampsite6 = new Campsite({creator: "longadams", name: "somenewsite", rating: 4, description: "Testsite",
                                    directions: "tbd", price: 20, lat: 36.1451, long: -86.4901, size: "large", tags: ["pet-friendly", "grill"],
                                    fire: false, reviews: []});


    db.collection('campsites').insert(testCampsite)
    db.collection('campsites').insert(testCampsite2)
    db.collection('campsites').insert(testCampsite3)
    db.collection('campsites').insert(testCampsite4)
    db.collection('campsites').insert(testCampsite5)
    db.collection('campsites').insert(testCampsite6)
    var testReview = new Review({_id: reviewID, creator: "turnerstrayhorn", rating: 5, campsite: "Reedy Falls", reviewBody: "Yo this place was amazing!", helpful: 1, notHelpful: 1})
    db.collection('reviews').insert(testReview);
    callback()
}