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

            if (req.query.offset != undefined) {
                var myData = new searchTerm({
                    searchValue: req.params.searchTerm,
                    offset: req.query.offset.toString()
                });
            } else {
                var myData = new searchTerm({
                    searchValue: req.params.searchTerm,
                    offset: 'undefined'
                });
            }

            searchTerm.find({
                    "searchValue": req.params.searchTerm
                })
                .exec(function (err, results) {
                    if (err) res.send(err);
                    myData.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        console.log('New searchTerm saved to database.');
                        bingSearch(req.params.searchTerm, res, req.query.offset);
                    });
                });
        });

    app.route('/api/latestimagesearch')
        .get((req, res) => {
            searchTerm.find({}, {}, { sort: { 'createdAt' : -1 }, limit: 10 }, function(err, post) {
                res.send(post);
              });
        });

    // app.route('/api/remove')
    //     .get((req, res) => {
    //         searchTerm.remove(function (err, product) {
    //             if (err) res.send(err);
    //             res.type('txt').send("Searchterms collection cleared.");
    //         });
    //     });

    app.use((req, res, next) => {
        res.status(404);
        res.type('txt').send('404, not found.');
    });

};