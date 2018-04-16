const dotenv = require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null, user);
    });
});

passport.use(
    new FacebookStrategy({
        //options for the facebook strategy
        clientID: process.env.FACEBOOKCLIENTID,
        clientSecret: process.env.FACEBOOKCLIENTSECRET
        // callbackURL: '/auth/facebook/redirect'
    }, (accessToken, refreshToken, profile, done) => {
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
        //check if user already exists in database
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                //found a user in database, do something
                console.log("User found: " + profile.displayName + "\n");
                done(null, currentUser);
            } else {
                //new user, create new record in database
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    polls: 0,
                    timesVoted: 0
                }).save().then((newUser) => {
                    console.log("New user created: " + profile.displayName + "\n");
                    done(null, newUser);
                });
            }
        })
    })
);