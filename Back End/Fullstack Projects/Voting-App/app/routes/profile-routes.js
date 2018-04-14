const router = require('express').Router();
const checkAuth = require('../isAuthenticated');
const passport = require('passport');
const User = require('../../models/user-model');
const renderPage = require('./render');

router.get('/dashboard', checkAuth, (req, res) => {
    renderPage(req, res, 'Dashboard', req.user);
});

router.get('/profile', checkAuth, (req, res) => {
    renderPage(req, res, 'Profile', req.user);
});

module.exports = router;