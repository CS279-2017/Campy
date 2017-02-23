const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    salt: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    reviews: [String],
    votedReviews: [String],
    email: String

}, { timestamps: true });
const saltRounds = 10;
const User = mongoose.model('User', userSchema);
module.exports = User;

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function comparePassword(candidatePassword, hash,  callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err;
      callback(null, isMatch);
    });
};

module.exports.getUserById = function(id, callback) {
    var query = {_id: id};
    User.findById(id, callback);
}

module.exports.createUser = function(user, callback) {
    this.getUserByUsername(user.username, function(err, res) {
        // If there is no record in the DB that matches the username, then we can add a new user to the DB.
        if (!res) {
            let salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(user.password, salt);

            var userToInsert = new User({username: user.username, password: hash, email: user.email, salt: salt});
            userToInsert.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log('Added user ' + user.username);
                    callback(null);
                }
            })
        } else {
            callback('User already exists in the database');
        }
    });
}