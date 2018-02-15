'use strict';

const express = require('express'),
  routes = require('./app/routes/index.js'),
  mongo = require('mongodb').MongoClient();

const app = express();
const port = 3000;

mongo.connect('mongodb://localhost:27017/clementinejs', (err, db) => {
  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log("MongoDB successfully connected on port 27017.");
  }

  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

  routes(app, db);

  app.listen(port, () => {
    console.log("Now listening on port: " + port);
  });

});
