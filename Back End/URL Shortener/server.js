'use strict';

const dotenv = require('dotenv').config();
const fs = require('fs');
const express = require('express');
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const urlTotalId = process.env.URLTOTALID;
const url = process.env.MONGOLAB_URI;
const appUrl = "https://url-shortener-vinarius.glitch.me/";

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

mongo.connect(url, (err, db) => {
  if(err){
    console.log("error connecting to db");
  } else {
    console.log("success, connected to mongodb");
  }
  
const vinBacon = db.db('vin-bacon');
  
function get_By_Id(id, callback){
  vinBacon.collection('urls').findOne({"_id": new ObjectId(id)}, (err, doc) => {
    if(err){console.error(err);}
    callback(doc);
  });
}
  
function incrementUrlTotal(id, callback){
  vinBacon.collection('urls').findAndModify(
    {"_id": new ObjectId(id)},
    [],
    {$inc: {urlTotal: 1}}, (err, doc) => {
    callback(err, doc);
  }); 
}
  
function validateUrlInput(str){
  var re = /^(http|https):\/\/[\w\.]+\.\S+/;
  return re.test(str);
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
// var myShortenedUrls = vinBacon.collection('urls').find({});
//  console.log(myShortenedUrls);
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.route('/urlshorten/:originalurl(*)')
    .get(function(req, res) {
        let myUrlObject = {
          originalUrl: req.params.originalurl
        };
        let myErrObj = {
          error: 'input not valid'
        };
        //if urlshorten input is valid
        if(validateUrlInput(myUrlObject.originalUrl)){
        vinBacon.collection('urls').findOne({$or: [{shortenedUrl: myUrlObject.originalUrl}, {url: myUrlObject.originalUrl}]}, (err, doc) => {
          if(err){ console.error(err);}
          //if url isn't in db, insert it and send to client
          if(doc == undefined){
            console.log("Inserting URL.");
            var shortenedURL;
            get_By_Id(urlTotalId, (doc) => {
              shortenedURL = appUrl + "vin" + (doc.urlTotal + 1).toString();
              console.log('shortenedURL:',shortenedURL);
              vinBacon.collection('urls').insertOne({url: myUrlObject.originalUrl, shortenedUrl: shortenedURL}, (err, newDoc) => {
              if(err) {console.error(err);}

              incrementUrlTotal(urlTotalId, (err, doc) => {
                if(err) {console.error(err);}
                get_By_Id(urlTotalId, (doc) => {
                  console.log("Url total in database:", doc.urlTotal);
                });
              });
                
            });
              
              vinBacon.collection('urls').findOne({shortenedUrl: shortenedURL}, (err, result) => {
                res.json(result);
              });
           });
          } else {
            //url is in db, send back to client
            console.log('Url found!');
            res.json(doc);
          }
        });
      } else {
           res.json(myErrObj);
         }
    })
  
  app.route('/*')
    .get((req, res) => {
    const appUrl2 = 'https://url-shortener-vinarius.glitch.me';
    vinBacon.collection('urls').findOne({shortenedUrl: appUrl2 + req.url}, (err, doc)=>{
      if(err) {console.error(err);}
      if(doc == null){
        res.status(404);
        res.type('txt').send('404: Url not found');
      } else {
        res.redirect(doc.url);
      }
    });
  });

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('404: Url Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})
  
  app.listen(process.env.PORT, function () {
    console.log('Node.js listening ...');
    get_By_Id(urlTotalId, (doc) => {
      console.log("Url total in database:", doc.urlTotal);
    });
  });
  
}); //end mongo connect