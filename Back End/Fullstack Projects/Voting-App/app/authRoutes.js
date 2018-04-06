const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res) =>{
    res.render('login');
});

router.get('/logout', (req, res) => {
    //handle with passport
    res.render('logout');
});

router.get('/facebook', passport.authenticate('facebook',{
    scope: ['profile']
}));

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    res.render('success');
});

module.exports = router;