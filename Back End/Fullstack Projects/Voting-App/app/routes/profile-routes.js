const router = require('express').Router();
const checkAuth = require('../isAuthenticated');
const passport = require('passport');
const User = require('../../models/user-model');

router.get('/dashboard', checkAuth, (req, res) => {
    res.render('dashboard', {title: 'Vin Votes | Dashboard'});
});

router.get('/profile', checkAuth, (req, res) => {
    res.render('profile', {title: 'Vin Votes | Profile'});
});

    // res.render('success', {
    //     username: req.user.username
    // });

module.exports = router;