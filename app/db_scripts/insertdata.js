let mongoose        = require('mongoose'),
    ObjectId        = mongoose.Types.ObjectId,
    User            = require('../models/User'),
    Review          = require('../models/Review'),
    Campsite        = require('../models/Campsite')


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
    console.log('Removed campsite collection data')
    User.remove({}, function(err) {
        console.log('Removed user data')
        Review.remove({}, function(err) {
            console.log('Removed review data')
            loadTestData(function() {
                console.log('Loaded all new data')
            });
        });
    });
});
/**
Loads test information into the MongoDB store.
*/
function loadTestData(callback) {
    var reviewID = new ObjectId()

    var testUser1 = new User({username: "turnerstrayhorn", password:"password1", passwordResetToken: "sillyreset", reviews: [reviewID], votedReviews: []})
    var testUser2 = new User({username: "harrisonstall", password:"password2", passwordResetToken: "sillyreset", reviews: [], votedReviews: [reviewID]})
    var testUser3 = new User({username: "longadams", password:"password3", passwordResetToken: "sillyreset", reviews: [], votedReviews: [reviewID]})
    db.collection('users').insert(testUser1);
    db.collection('users').insert(testUser2);
    db.collection('users').insert(testUser3);
    
    var testCampsite = new Campsite({creator: "harrisonstall", rating: 5, description: "There are some cool waterfalls. Highly recommend.",
                                    directions: "Hop the boulder", price: 0, lat: 36.142980, long: -86.805682, size: "small", tags: ["waterfall", "fun"],
                                    fire: true, reviews: [reviewID]});

    var testCampsite2 = new Campsite({creator: "turnerstrayhorn", rating: 5, description: "Great hiking trails! And great hot chicken!",
                                    directions: "Call ahead to skip the line", price: 15, lat: 36.1514, long: -86.7966, size: "medium", tags: ["hattie bs", "fun"],
                                    fire: true, reviews: []});

    var testCampsite3 = new Campsite({creator: "turnerstrayhorn", rating: 4, description: "Good southern camping!",
                                    directions: "Family style", price: 20, lat: 36.1151, long: -86.6901, size: "large", tags: ["monell's", "southern"],
                                    fire: false, reviews: []});

    db.collection('campsites').insert(testCampsite)
    db.collection('campsites').insert(testCampsite2)
    db.collection('campsites').insert(testCampsite3)
    var testReview = new Review({_id: reviewID, creator: "turnerstrayhorn", rating: 5, campsite: "Reedy Falls", reviewBody: "Yo this place was amazing!", helpful: 1, notHelpful: 1})
    db.collection('reviews').insert(testReview);
    callback()
}