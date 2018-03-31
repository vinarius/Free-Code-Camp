const path = process.cwd();

module.exports = (app) => {

    app.route('/')
        .get((req, res) => {
            res.sendFile(path + '/public/index.html');
        });

}