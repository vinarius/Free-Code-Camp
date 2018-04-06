const dotenv = require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const path = process.cwd();
const port = process.env.PORT || 8080;
const routes = require('./app/routes');
const authRoutes = require('./app/authRoutes');
const bodyParser = require('body-parser');
const session = require('express-session');
const passportSetup = require('./app/passport-setup');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'pug');
app.set('views', './public/views');

app.use('/auth', authRoutes);
routes(app);

app.listen(port, (err) => {
    if (err) {
        console.error('Error starting node app:', err);
    }
    console.log("Node app listening on port:", port);
});