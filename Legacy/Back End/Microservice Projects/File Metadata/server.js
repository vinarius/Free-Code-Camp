const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const bodyParser = require('body-parser');
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('/public'));

app.route('/')
  .get((req, res)=>{
    res.sendFile(process.cwd() + '/views/index.html');
});

app.route('/upload')
  .post(upload.single('testFile'), (req, res, next)=>{
      var returnObject = {
        size: req.file.size
      };
  res.json(returnObject);
    });

app.use((req, res, next)=>{
  res.status(404);
  res.type('txt').send('404: page not found.');
});

app.listen(port || 5000, ()=> {
  console.log("Node app listening on port:", port || 5000);
});