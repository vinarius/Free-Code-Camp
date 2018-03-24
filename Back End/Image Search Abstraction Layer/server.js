const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const apiKey = process.env.APISUBKEY;
const path = process.cwd();
const routes = require('./app/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const searchTerm = require('./app/searchTermSchema');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect(process.env.MONGODB_URI || process.env.DBURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('MongoDB connected.');

    routes(app, db);

    app.listen(port, (err) => {
        if (err) console.error("Error starting node application:", err);
        console.log("Node application listening on", port);
    });
});