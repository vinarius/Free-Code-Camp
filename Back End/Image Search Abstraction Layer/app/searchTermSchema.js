const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchTermSchema = new Schema({
    searchValue: String
},
{
    collection: 'searchTerm',
    timestamps: true
});

const ModelClass = mongoose.model('searchTerm', searchTermSchema);

module.exports = ModelClass;