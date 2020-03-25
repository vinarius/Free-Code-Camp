'use strict';

require('dotenv').config();

process.env.NODE_ENV = 'test';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const helmet = require('helmet');
const MongoClient = require('mongodb').MongoClient;

var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
const port = process.env.PORT || 3000;

var app = express();

(async function () {
  try {
    app.use(helmet());
    app.use('/public', express.static(process.cwd() + '/public'));

    app.use(cors({
      origin: '*'
    })); //For FCC testing purposes only
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    //Sample front-end
    app.route('/:project/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/issue.html');
      });

    //Index page (static HTML)
    app.route('/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
      });

    //For FCC testing purposes
    fccTestingRoutes(app);

    const mongoClient = await MongoClient.connect(process.env.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = mongoClient.db(process.env.database);

    //Routing for API 
    apiRoutes(app, db);

    //404 Not Found Middleware
    app.use(function (req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

    //Start our server and tests!
    app.listen(port);

    console.log("Listening on port " + port);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          var error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 3500);
    }
  } catch (error) {
    console.error(error);
  }
})();

module.exports = app; //for testing
