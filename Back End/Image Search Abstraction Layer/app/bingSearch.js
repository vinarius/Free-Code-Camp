'use strict';
let https = require('https');

module.exports = (term, res, offset) => {

    function myCallbackFunction(res, input, offset) {

        function dataValue(altText, thumbnailUrl, contentUrl) {
            this.altText = altText;
            this.thumbnailUrl = thumbnailUrl;
            this.contentUrl = contentUrl;
        }

        var responseData = JSON.parse(input);
        var output = [];
        for (let i = 0; i < responseData.value.length; i++) {
            output.push(responseData.value[i]);
        }

        var desiredResult = [];

        if (offset) {
            for (let i = Number(offset); i < output.length; i++) {
                let dataObject = new dataValue(output[i].insightsMetadata.bestRepresentativeQuery.text, output[i].thumbnailUrl, output[i].hostPageUrl);
                desiredResult.push(dataObject);
            }
            res.send(desiredResult);
        } else {
            for (let i = 0; i < output.length; i++) {
                let dataObject = new dataValue(output[i].insightsMetadata.bestRepresentativeQuery.text, output[i].thumbnailUrl, output[i].hostPageUrl);
                desiredResult.push(dataObject);
            }
            res.send(desiredResult);
        }
    }

    let subscriptionKey = process.env.APISUBKEY;
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';

    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // console.log('\nRelevant Headers:\n');
            // for (var header in response.headers)
            //     if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
            //         console.log(header + ": " + response.headers[header]);
            // console.log('\nJSON Response:\n');
            myCallbackFunction(res, body, offset);
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