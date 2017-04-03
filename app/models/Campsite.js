const mongoose = require('mongoose');

const campsiteSchema = new mongoose.Schema({
    name: {type:String, unique:true},
    creator: String, // technically User.username
    rating: [Number],
    dateCreated: {type: Date, default: Date.now },
    description: String,
    directions: String,
    price: Number,
    lat: Number,
    long: Number,
    size: String,
    tags: [String],
    fire: Boolean,
    reviews: [String], // string IDs of reviews corresponding to this site
    images:[String]
}, { timestamps: true });

const Campsite = mongoose.model('Campsite', campsiteSchema);
module.exports = Campsite;


//takes in a window object with two longitude latitude objects and returns all campsites geographically located
//within the window
//i.e. 
//window = {latLng1:l1, latLng2:l2}
//l1 = {lng:103.42350, lat:134.324}
//Note: They don't need to be in order
module.exports.getCampsitesByWindow = function(window) {
    let minLat = min(window.latLng1.lat, window.latLng2.lat);
    let maxLat = max(window.latLng1.lat, window.latLng2.lat);
    let minLng = min(window.latLng1.lng, window.latLng2.lng);
    let maxLng = max(window.latLng1.lng, window.latLng2.lng);

    var query = {username: username};

    User.find(query, callback);

    Campsite.find({
        lat:{
            $gte:minLat,
            $lte:maxLat
        },
        long:{
            $gte:minLng,
            $lte:maxLng
        }
    }, function (err, sites) {

        if (err) {
            console.log("An error occurred");
            return;
        }

        if (results.length > 0)
        {
            return sites;
        }
    });

}
