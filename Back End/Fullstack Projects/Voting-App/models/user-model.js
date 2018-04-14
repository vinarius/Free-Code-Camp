const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    polls: Number,
    timesVoted: Number
});

const User = mongoose.model('user', userSchema);

module.exports = User;