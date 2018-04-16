const router = require('express').Router();
const checkAuth = require('../isAuthenticated');
const passport = require('passport');
const User = require('../../models/user-model');
const renderPage = require('./render');

router.get('/dashboard', checkAuth, (req, res) => {
    renderPage(req, res, 'Dashboard');
});

router.get('/profile', checkAuth, (req, res) => {
    renderPage(req, res, 'Profile');
});

module.exports = router;