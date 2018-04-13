const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    firstName: String,
    lastName: String,
    gender: String
});

const Test = mongoose.model('test', testSchema);

module.exports = Test;