const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewId: mongoose.Schema.ObjectId,
    creator: String, // technically User.username
    rating: Number,
    campsite: String, // campsite_id, subject to change
    dateCreated: {type: Date, default: Date.now },
    dateVisited: Date,
    reviewBody: String,
    helpful: {type: Number, default: 0}, // how many people marked the review as helpful
    notHelpful: {type: Number, default: 0} // how many people said it was not helpful
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;