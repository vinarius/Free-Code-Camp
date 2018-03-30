'use strict';
let https = require('https');

let body = '';

module.exports = (term, res) => {

    function myCallbackFunction(res, input) {
        var responseData = JSON.parse(input);
        res.send(responseData);
    }

    let subscriptionKey = process.env.APISUBKEY;
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';

    let response_handler = function (response) {
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // console.log('\nRelevant Headers:\n');
            // for (var header in response.headers)
            //     if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
            //         console.log(header + ": " + response.headers[header]);
            // console.log('\nJSON Response:\n');
            myCallbackFunction(res, body);
        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let bing_image_search = function (search) {
        console.log('Searching images for: ' + term);
        let request_params = {
            method: 'GET',
            hostname: host,
            path: path + '?q=' + encodeURIComponent(search),
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            }
        };

        let req = https.request(request_params, response_handler);
        req.end();
    }

    if (subscriptionKey.length === 32) {
        bing_image_search(term);
    } else {
        console.log('Invalid Bing Search API subscription key.');
    }

}