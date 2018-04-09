const path = process.cwd();

module.exports = (app) => {

    app.route('/')
        .get((req, res) => {
            res.render('home', {title: "Vin Votes | Home"});
        });

    app.use((req, res, next)=>{
        res.status(404);
        res.render('404', {title: "Vin Votes | 404"});
    });

}