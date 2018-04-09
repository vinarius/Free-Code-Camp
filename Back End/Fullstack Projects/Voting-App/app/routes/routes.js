const path = process.cwd();

module.exports = (app) => {

    app.route('/')
        .get((req, res) => {
            res.render('home', {title: "Voting App | Home"});
        });

    app.use((req, res, next)=>{
        res.status(404);
        res.type('txt').send("404, route not found. :(");
    });

}