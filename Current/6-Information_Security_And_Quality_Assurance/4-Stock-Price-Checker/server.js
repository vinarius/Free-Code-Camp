'use strict';

require('dotenv').config();

process.env['NODE_ENV'] = "test";
process.env['collection'] = `stocks`;
process.env['database'] = `stock-price-checker`;
process.env['MONGO_URL'] = `mongodb+srv://vinarius:Romans623@vincluster-q5s8p.mongodb.net/test?retryWrites=true&w=majority`;
process.env['apiKey'] = `4YADI16RR927YZ7T`;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const helmet = require('helmet');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();
const serverPort = process.env.PORT || 3000;

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    "script-src": ["'self'", 'code.jquery.com/jquery-2.2.1.min.js']
  }
}));
app.use('/public', express.static(__dirname + '/public'));

app.use(cors({
  origin: '*'
})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

(async function () {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true
    });
    const collection = client.db(process.env.database).collection(process.env.collection);

    //Routing for API 
    apiRoutes(app, collection);

    //404 Not Found Middleware
    app.use(function (req, res, next) {
      res.status(404)
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
            const error = e;
            console.log('Tests are not valid:');
            console.log(error);
          }
        }, 3500);
      }
    });
  } catch (error) {
    console.error('Error in server start: ' + error);
  }

})();

module.exports = app; //for testing