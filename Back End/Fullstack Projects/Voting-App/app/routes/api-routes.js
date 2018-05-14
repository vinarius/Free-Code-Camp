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

router.post('/pollData', checkAuth, (req, res) => {
    Poll.find({
        name: req.body.pollName
    }).then((pollDoc) => {
        if (pollDoc[0]) {
            //poll found, do stuff with doc
            res.send(pollDoc[0]);
        } else {
            //poll not found, do stuff
            let newPoll = new Poll({
                name: req.body.pollName,
                datasets: []
            });
            newPoll.save().then((result) => {
                res.send(result);
            });
        }
    })
});

router.post('/pollData/updatePoll', checkAuth, (req, res) => {
    switch (req.body.updateStatus) {
        case 'addDataset':
            let conditions = {
                    name: req.body.currentPoll
                },
                updateData = {
                    $push: {
                        datasets: {
                            label: req.body.optionName,
                            count: 0
                        }
                    }
                };
            Poll.update(conditions, updateData).then((result) => {
                Poll.find({
                    name: req.body.currentPoll
                }).then((doc) => {
                    res.send(doc);
                });
            });
            break;
        case 'voteDataset':
            //find dataset, if exists increment dataset count by 1
            //else create new dataset and increment dataset count by 1

            Poll.find({
                'datasets.label': req.body.optionName,
                name: req.body.currentPoll
            }).then((findResult) => {
                if (findResult[0]) {
                    let conditions = {
                            name: req.body.currentPoll,
                            'datasets.label': req.body.optionName
                        },
                        updateData = {
                            $inc: {
                                'datasets.$.count': 1
                            }
                        };
                    Poll.update(conditions, updateData).then((updateResult) => {
                        Poll.find({
                            // name: req.body.currentPoll
                            'datasets.label': req.body.optionName,
                            name: req.body.currentPoll
                        }).then((doc) => {
                            res.send(doc);
                        })
                    });
                } else {
                    let conditions = {
                            name: req.body.currentPoll
                        },
                        updateData = {
                            $push: {
                                datasets: {
                                    label: req.body.optionName,
                                    count: 1
                                }
                            }
                        };
                    Poll.update(conditions, updateData).then((result) => {
                        Poll.find({
                            name: req.body.currentPoll
                        }).then((doc) => {
                            res.send(doc);
                        });
                    });
                }
            });
            break;
        case 'removeDataset':
            //find dataset, if exists remove
            //else res.send dataset not found
            let removeConditions = {
                    name: req.body.currentPoll,
                    'datasets.label': req.body.optionName
                },
                removeUpdateData = {
                    $pull: {
                        datasets: {label: req.body.optionName}
                    }
                };
            Poll.update(removeConditions, removeUpdateData).then((result)=>{
                Poll.find({
                    name: req.body.currentPoll
                }).then((doc)=>{
                    res.send(doc);
                });
            });
            break;
        default:
            res.send('invalid post status');
            break;
    }
});

router.get('/getUserPolls', checkAuth, (req, res) => {
    console.log('get request received on /api/getUserPolls');
    console.log('req.user:', req.user);
    res.end();
});

module.exports = router;