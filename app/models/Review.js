const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId

const reviewSchema = new mongoose.Schema({
    creator: String, // technically User.username
    rating: Number,
    campsite: String, // campsite_id, subject to change
    dateCreated: {type: Date, default: Date.now },
    //dateVisited: Date,
    reviewBody: String,
    helpful: {type: Number, default: 0}, // how many people marked the review as helpful
    notHelpful: {type: Number, default: 0} // how many people said it was not helpful
}, { timestamps: true } );

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;


//returns all reviews for a given id
module.exports.getReviewsByCampsiteId = function(campsite_id, callback) {
    var query = {campsite: campsite_id};
    Review.find(query, callback);
}

//adds review
module.exports.addReview = function(data, callback) {
	let review = new Review({creator:data.user, rating:data.rating, campsite:data.campsite, reviewBody:data.reviewBody});
    review.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log('Added review ' +review._id);
                    callback(null);
                }
            });
}

