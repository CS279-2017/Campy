const mongoose = require('mongoose');

const campsiteSchema = new mongoose.Schema({
    name: String,
    creator: String, // technically User.username
    rating: Number,
    dateCreated: {type: Date, default: Date.now },
    description: String,
    directions: String,
    price: Number,
    lat: Number,
    long: Number,
    size: String,
    tags: [String],
    fire: Boolean,
    reviews: [String] // string IDs of reviews corresponding to this site

}, { timestamps: true });

const Campsite = mongoose.model('Campsite', campsiteSchema);
module.exports = Campsite;