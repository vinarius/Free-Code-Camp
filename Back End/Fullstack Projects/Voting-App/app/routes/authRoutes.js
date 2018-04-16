const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res) =>{
    res.render('login');
});

router.get('/logout', (req, res) => {
    //handle with passport
    req.logout();
    res.redirect('/');
});
//------------

//facebook
router.get('/facebook', passport.authenticate('facebook',{
    scope: ['profile']
}));

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/user/dashboard');
});
//------------

//Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//callback for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/user/dashboard');
});
//------------

module.exports = router;