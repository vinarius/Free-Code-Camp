const dotenv = require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
    new FacebookStrategy({
        //options for the facebook strategy
        clientID: process.env.FACEBOOKCLIENTID,
        clientSecret: process.env.FACEBOOKCLIENTSECRET,
        callbackURL: '/auth/facebook/redirect'
    }, (accessToken, refreshToken, profile, done) =>{
        //passport callback function
        console.log('passport facebook callback function fired');
    })
);

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLECLIENTID,
        clientSecret: process.env.GOOGLECLIENTSECRET,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback function
        // console.log('passport google callback function fired');
        console.log(profile);
    })
);