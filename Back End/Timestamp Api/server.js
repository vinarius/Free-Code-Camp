'use strict';
const express = require('express');
const app = express();
app.use(express.static(__dirname));

//external
const strftime = require('strftime');
const moment = require('moment');

app.get('/:date', (req, res) => {
  const initialDateParam = req.params.date;
  const initialUnixTimestamp = parseInt(initialDateParam, 10);
  const isInt = typeof initialUnixTimestamp === 'number' && !isNaN(initialUnixTimestamp);
  
  let unixToSendBack = '';
  let dateToSendBack = initialDateParam;
  
  if (isInt) {
    dateToSendBack = strftime('%B %d' + ', ' + '%Y', new Date(initialUnixTimestamp * 1000));
    unixToSendBack = initialUnixTimestamp;
  } else if(moment(initialDateParam).format() === 'Invalid date'){
      dateToSendBack = null;
      unixToSendBack = null;
  }
  else {
    unixToSendBack = Number(moment(initialDateParam).format('X'));
    dateToSendBack = moment(initialDateParam).format('MMMM D' + ', ' + 'gggg');
  }
  
  res.status(200).json({
    unix: unixToSendBack,
    natural: dateToSendBack
  });
});

app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
  });

app.listen(process.env.PORT, () => {
    console.log('listening for bacon on port 8080');
});
