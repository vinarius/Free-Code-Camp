'use strict';

// process.env['NODE_ENV'] = 'test';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const helmet = require('helmet');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(helmet());
app.use(helmet.referrerPolicy({
  policy: 'same-origin'
}));
const serverPort = process.env.PORT || 3000;

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({
  origin: '*'
})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Sample front-end
app.route('/b/:board/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

//Index page (static HTML)
app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//Sample Front-end


//404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

(async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const collection = client.db(process.env.database).collection(process.env.collection);
    app.locals.collection = collection;

    app.listen(serverPort);
    console.log("Listening on port " + serverPort);

    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(() => {
        runner.run();
      }, 1500);
    }
  } catch (error) {
    console.error('Error starting server:', error);
  }

})();

module.exports = app; //for testing
