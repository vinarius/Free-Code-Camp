'use strict';

const port = 8080;

//internal
const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

//external


var urlObj = {
    original_url: '',
    short_url: ''
};

app.use(express.static('./'));


app.get('/new/', (req, res) => {
    
    res.json(JSON.stringify(urlObj));
    
});

app.listen(port, () => {
    console.log('listening for bacon on ' + port);
});