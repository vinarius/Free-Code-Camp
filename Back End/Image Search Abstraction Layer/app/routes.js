const path = process.cwd();
const mongoose = require('mongoose');
const searchTerm = require('./searchTermSchema');

module.exports = (app, db) => {

    app.route('/')
        .get((req, res) => {
            res.sendFile(path + '/index.html');
        });

    app.route('/api/imagesearch/:searchTerm*')
        .get((req, res) => {

            searchTerm.find({
                    "searchValue": req.params.searchTerm
                })
                .exec(function (err, results) {
                    if (err) res.send("Error searching the database.");
                    if (results[0] == undefined) {
                        var myData = new searchTerm({
                            searchValue: req.params.searchTerm
                        });
                        myData.save(function (err) {
                            if (err) {
                                res.send("Error saving new searchTerm to the database.");
                            }
                            res.json(myData);
                            console.log('New searchTerm saved to database.');
                        });
                    } else {
                        res.json(results);
                    }
                });

        });

    app.use((req, res, next) => {
        res.status(404);
        res.type('txt').send('404, not found.');
    });

};