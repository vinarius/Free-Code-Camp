'use strict';

//input
const port = process.env.PORT;

//internal
const express = require('express');
const app = express();
const http = require('http');

//external
const useragent = require('express-useragent');
var proxyaddr = require('proxy-addr');

function organize(a) {
    let input = a.source;

    let desire = [];
    let temp;

    let test = input.split(' ');

    for (let i = 1; i < 6; i++) {
        desire.push(test[i]);
    }

    desire[0] = desire[0].split('');
    desire[0].shift();
    desire[0] = desire[0].join('');

    temp = desire[4].split('');
    temp.pop();
    temp = temp.join('');

    desire[4] = temp;

    desire = desire.join(' ');

    return desire;
}

var srv = http.createServer(function(req, res) {
    var source = req.headers['user-agent'],
        ua = useragent.parse(source);
    res.writeHead(200, {
        'Content-Type': 'text/json'
    });

    var softwareResult = organize(ua);
    var languageResult = req.headers["accept-language"].split(',');
    languageResult = languageResult[0];

    var result = {
        ipaddress: proxyaddr.all(req)[1],
        language: languageResult,
        software: softwareResult
    };

    res.end(JSON.stringify(result));
});

srv.listen(port, () => {
    console.log('listening for bacon on ' + port);
});