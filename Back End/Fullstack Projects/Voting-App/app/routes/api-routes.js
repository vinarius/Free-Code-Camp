const router = require('express').Router();
const User = require('../../models/user-model');
const Test = require('../../models/test-model');
const Poll = require('../../models/poll-model');
const renderPage = require('./render');
const checkAuth = require('../isAuthenticated');

router.get('/querydb', (req, res) => {
    User.find({}).then((result) => {
        if (result) {
            res.send(result);
        } else {
            res.send("No results found");
        }
    })
});

router.post('/querydb', (req, res) => {
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
    Test.find({}).then((result) => {
        res.send(result);
    });
});

router.get('/updateUser', checkAuth, (req, res) => {
    User.find({
        '_id': req.user.id
    }).then((dbUser) => {
        res.send(dbUser[0]);
    });
});

router.post('/updateUser', checkAuth, (req, res) => {
    switch (req.body.updateStatus) {
        case 'createPoll':
            User.find({
                '_id': req.user.id
            }).update({
                $inc: {
                    polls: 1
                }
            }).then(() => {
                User.find({
                    '_id': req.user.id
                }).then((dbUser) => {
                    res.send(dbUser[0]);
                });
            });
            break;
        case 'deleteAllPolls':
            User.find({
                '_id': req.user.id
            }).update({
                $set: {
                    polls: 0
                }
            }).then(() => {
                User.find({
                    '_id': req.user.id
                }).then((dbUser) => {
                    res.send(dbUser[0]);
                });
            });
            break;
        default:
            res.send('Invalid request type.');
    }
});

router.get('/pollData', checkAuth, (req, res)=>{
    console.log('Get request received: /pollData');
    res.send('yo sup');
});

router.post('/pollData', checkAuth, (req, res)=>{
    console.log('Post request received: /pollData');
    Poll.find({
        name: req.body.pollName
    }).then((pollDoc)=>{
        if(pollDoc[0]){
            //poll found, do stuff with doc
            console.log('it thinks it found one');
            console.log(pollDoc[0]);
            res.send(pollDoc[0]);
        } else {
            //poll not found, do stuff
            console.log('poll not found, creating new poll: ' + req.body.pollName);
            let newPoll = new Poll({
                name: req.body.pollName,
                dataset: [{
                    label: 'Nothing for now',
                    count: 0
                }]
            });
            newPoll.save().then((result)=>{
                res.send(result);
            });
        }
    })
});

module.exports = router;