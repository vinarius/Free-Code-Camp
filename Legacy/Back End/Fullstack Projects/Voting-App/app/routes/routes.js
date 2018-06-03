const mongoose = require('mongoose');
const renderPage = require('./render');

module.exports = (app) => {

    app.route('/')
        .get((req, res) => {
            renderPage(req, res, 'Home');
        });

    app.route('/polls')
        .get((req, res) => {
            renderPage(req, res, 'Polls');
        });

    app.route('/todo')
        .get((req, res)=>{
            renderPage(req, res, 'Todo');
        });

    app.use((req, res, next) => {
        res.status(404);
        res.render('404', {
            title: "Vin Votes | 404"
        });
    });

}