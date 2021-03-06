const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = process.cwd();
const port = process.env.PORT || 8080;
const routes = require('./app/routes/routes');
const authRoutes = require('./app/routes/authRoutes');
const profileRoutes = require('./app/routes/profile-routes');
const apiRoutes = require('./app/routes/api-routes');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passportSetup = require('./app/passport-setup');
const passport = require('passport');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'pug');
app.set('views', './public/views');
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIEKEY]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/user', profileRoutes);
routes(app);

mongoose.connect(process.env.DBURI, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Mongoose connected to database.');
        app.listen(port, (err) => {
            if (err) {
                console.error('Error starting node app:', err);
            } else {
                console.log("Node app listening on port:", port);
            }
        });
    }
});