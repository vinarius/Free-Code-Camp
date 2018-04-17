const router = require('express').Router();
const checkAuth = require('../isAuthenticated');
const passport = require('passport');
const renderPage = require('./render');
const User = require('../../models/user-model');
const Poll = require('../../models/poll-model');

router.get('/dashboard', checkAuth, (req, res) => {
    renderPage(req, res, 'Dashboard');
});

router.get('/profile', checkAuth, (req, res) => {
    renderPage(req, res, 'Profile');
});

module.exports = router;