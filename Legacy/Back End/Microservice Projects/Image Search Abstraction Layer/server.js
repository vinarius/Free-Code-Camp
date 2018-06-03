// External query api uses a trial Microsoft Azure key registered 3/18/18 and expires -->
// 30 days after registration after which requires payment. App will no longer function
// after 4/17/18.

const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const routes = require('./app/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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