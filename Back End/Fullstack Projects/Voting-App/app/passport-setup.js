const dotenv = require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

passport.use(
    new FacebookStrategy({
        //options for the facebook strategy
        clientID: process.env.FACEBOOKCLIENTID,
        clientSecret: process.env.FACEBOOKCLIENTSECRET,
        callbackURL: '/auth/facebook/redirect'
        // callbackURL: 'localhost:8080/auth/facebook/redirect'
    }, (accessToken, refreshToken, profile, done) =>{
        //passport callback function
        console.log('passport callback function fired');
    })
);