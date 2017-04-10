const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    salt: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    profilePicture:{type: String},
    reviews: [String],
    votedReviews: [String],
    email: { type: String, unique: true }

}, { timestamps: true });
const saltRounds = 10;
const User = mongoose.model('User', userSchema);
module.exports = User;

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
}

module.exports.getProfilePicByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, function(err, user){
        if(err){
            callback({error:err});
        }else{
            console.log(user);
            callback({profilePicture:user.profilePicture});
        }
    })
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
            module.exports.getUserByEmail(user.email, function(err, res) {
                if (!res) {
                    let salt = bcrypt.genSaltSync(saltRounds);
                    var hash = bcrypt.hashSync(user.password, salt);
                    var userToInsert = new User({username: user.username, password: hash, email: user.email, salt: salt, profilePicture: user.profilePicture});
                    userToInsert.save(function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('Added user ' + user.username);
                            callback(null);
                        }
                    });
                }
                else {
                    callback('Email already exists in the database')
                }
            });
        } else {
            callback('User already exists in the database');
        }
    });
}