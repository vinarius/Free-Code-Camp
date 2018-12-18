const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://vin_test:password1@ds237574.mlab.com:37574/free-code-camp' )
const Schema = mongoose.Schema;

function isValidReq(from, to){
  return (from && to);
}

const userSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  log: [{
    description: String,
    duration: Number,
    date: String
  }]
});

const User = mongoose.model('User', userSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res, done)=>{
  let username = req.body.username;
  let user = new User({
    userId: username,
    log: []
  });
  
  User.findOne({username: username}, (err, d)=>{
    if(err) done(err);
    console.log(d);
    if(!d){
      user.save((err, d)=>{
        if(err) done(err);
        res.json(d);
      });
    } else {
      res.send('Username already exists.');
    }
  });
});

app.get('/api/exercise/users', (req, res, done)=>{  
  User.find({}, (err, d)=>{
    if(err){done(err)}
    res.json(d);
  });
});

app.post('/api/exercise/add', (req, res, done)=>{
  let date = req.body.date;
  date = date.split('-');
  let delta = date.shift();
  date.push(delta);
  date = date.join('-');
  //MM/DD/YYYY
  let temp = { description: req.body.description, duration: req.body.duration, date: date };
  
  User.findOneAndUpdate(
    {userId: req.body.userId},
    { $push: { log: temp} },
    {new: true},
    (err, d)=>{
      if(err) done(err);
      res.json(d);
    });  
});

app.get('/api/exercise/log/:userId', (req, res, done)=>{
  User.findOne(
    {userId: req.params.userId}, (err, d)=>{
    if(err) done(err);
      let result = d;
      if(d === null){
        res.send('User Id not found.');
      }
    //if user entered parameters of from and to for date range filter
    if(isValidReq(req.query.from, req.query.to)){
      //filter document
      let log = d.log;
      result = log.filter((el, i) => {
        let elDate = new Date(el.date).getTime() / 1000;
        let fromDate = new Date(req.query.from).getTime() / 1000;
        let toDate = new Date(req.query.to).getTime() / 1000;
        return elDate >= fromDate && elDate <= toDate;
      });
      res.json(result);
    } else if(req.query.from && !req.query.to){
      res.send('to parameter required');
    } else if(!req.query.from && req.query.to){
      res.send('from parameter required');
    } else {
      res.json(result);
    }
  });  
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: '404 not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
