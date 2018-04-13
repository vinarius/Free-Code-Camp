const router = require('express').Router();
const User = require('../../models/user-model');

router.get('/querydb', (req, res) => {
    console.log("Request received.");
    User.find({}).then((result)=>{
        if(result){
            res.send(result);
        } else {
            res.send("No results found");
        }
    })
});

router.post('/querydb', (req, res) => {
    console.log('post received, querydb');
    res.send(req);
});

module.exports = router;