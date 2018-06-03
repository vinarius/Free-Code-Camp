const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    name: String,
    datasets: [{
        label: String,
        count: Number
    }]
});

const Poll = mongoose.model('poll', pollSchema);

module.exports = Poll;