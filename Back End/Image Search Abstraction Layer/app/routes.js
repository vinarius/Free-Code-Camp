const https = require('https');
const dotenv = require('dotenv').config();
const path = process.cwd();
const mongoose = require('mongoose');
const searchTerm = require('./searchTermSchema');
const bingSearch = require('./bingSearch');

module.exports = (app, db) => {

    app.route('/')
        .get((req, res) => {
            res.sendFile(path + '/index.html');
        });

    app.route('/api/imagesearchall')
        .get((req, res) => {
            searchTerm.find({}).exec(function (err, results) {
                if (err) {
                    res.send('Error finding all documents in database.');
                } else {
                    res.json(results);
                }
            });
        });

    app.route('/api/imagesearch/:searchTerm*')
        .get((req, res) => {
            searchTerm.find({
                    "searchValue": req.params.searchTerm
                })
                .exec(function (err, results) {
                    if (err) res.send(err);
                    if (results[0] == undefined) {
                        var myData = new searchTerm({
                            searchValue: req.params.searchTerm,
                            offset: req.query.offset
                        });
                        myData.save(function (err) {
                            if (err) {
                                res.send(err);
                            }
                            console.log('New searchTerm saved to database.');
                            //hit bing api and search
                            bingSearch(req.params.searchTerm, res);
                        });
                    } else {
                        // res.json(results);
                        console.log('searchTerm found in database.');
                        //hit bing api and search
                        bingSearch(req.params.searchTerm, res);
                    }
                });

        });

    app.route('/remove')
        .get((req, res) => {
            searchTerm.remove(function (err, product) {
                if (err) res.send(err);
                res.send(product);
            });
        });

    app.use((req, res, next) => {
        res.status(404);
        res.type('txt').send('404, not found.');
    });

};