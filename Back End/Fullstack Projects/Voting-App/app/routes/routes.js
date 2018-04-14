const mongoose = require('mongoose');
const renderPage = require('./render');

module.exports = (app) => {

    app.route('/')
        .get((req, res) => {
            renderPage(req, res, 'Home', req.user);
        });

    app.route('/polls')
        .get((req, res) => {
            // res.render('polls', {
            //     title: "Vin Votes | Polls"
            // });
            renderPage(req, res, 'Polls', req.user);
        })

    app.use((req, res, next) => {
        res.status(404);
        res.render('404', {
            title: "Vin Votes | 404"
        });
    });

}