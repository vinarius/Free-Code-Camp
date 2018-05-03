require('dotenv').config();
const mongo = require('mongodb').MongoClient();
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const currentPath = process.cwd();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'pug');

app.route('/')
    .get((req, res)=>{
        res.sendFile(currentPath + '/index.html');
    });

app.listen(port, (err)=>{
    if(err){
        console.error('Error setting up server:', err);
    }
    console.log('Server listening on port:', port);
});