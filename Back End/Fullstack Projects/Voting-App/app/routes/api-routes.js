const router = require('express').Router();
const User = require('../../models/user-model');
const Test = require('../../models/test-model');

router.get('/querydb', (req, res) => {
    console.log("Request received.");
    User.find({}).then((result) => {
        if (result) {
            res.send(result);
        } else {
            res.send("No results found");
        }
    })
});

router.post('/querydb', (req, res) => {
    console.log('post received: /api/querydb');
    let user = {
        firstName: '',
        lastName: '',
        gender: ''
    }
    Test.findOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender
    }).then((currentUser) => {
        if (currentUser) {
            console.log('User found: ' + currentUser.firstName + " " + currentUser.lastName);
            user.firstName = currentUser.firstName;
            user.lastName = currentUser.lastName;
            user.gender = currentUser.gender;
            res.send(user);
        } else {
            new Test({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender
            }).save().then((newUser) => {
                console.log("New user saved to database. " + req.body.firstName + " " + req.body.lastName);
                user.firstName = newUser.firstName;
                user.lastName = newUser.lastName;
                user.gender = newUser.gender;
                res.send(user);
            })
        }
    })
});

router.get('/queryall', (req, res) => {
    console.log("Get request received: /api/queryall");
    Test.find({}).then((result) => {
        res.send(result);
    });
});

module.exports = router;