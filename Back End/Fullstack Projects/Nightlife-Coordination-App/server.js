require('dotenv').config();
const mongo = require('mongodb').MongoClient();
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen();