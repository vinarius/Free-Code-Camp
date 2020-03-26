'use strict';

require('dotenv').config();

process.env['NODE_ENV'] = 'test';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const helmet = require('helmet');
const noCache = require('nocache');
const MongoClient = require('mongodb').MongoClient;

const serverPort = process.env.PORT || 3000;
var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');

var app = express();

app.use(helmet());
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 4.2.0'
}));
app.use(noCache());
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({
  origin: '*'
})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    return res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

(async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true
    });
    const db = client.db(process.env.database);

    //Routing for API 
    apiRoutes(app, db);

    //404 Not Found Middleware
    app.use(function (req, res, next) {
      return res.status(404)
        .type('text')
        .send('Not Found');
    });

    //Start our server and tests!
    app.listen(serverPort, function () {
      console.log("Listening on port " + serverPort);
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
        }, 1500);
      }
    });
  } catch (error) {
    console.error('Error in server:', error);
  }
})();

module.exports = app; //for unit/functional testing
