const path = process.cwd();
const mongoose = require('mongoose');

module.exports = (app) => {

    app.route('/')
        .get((req, res) => {
            res.render('home', {title: "Vin Votes | Home"});
        });
        // .post((req, res)=>{
        //     console.log(req);
        // });

    app.route('/polls')
        .get((req, res)=>{
            
            res.render('polls', {title: "Vin Votes | Polls"});
        })

    app.use((req, res, next)=>{
        res.status(404);
        res.render('404', {title: "Vin Votes | 404"});
    });

}