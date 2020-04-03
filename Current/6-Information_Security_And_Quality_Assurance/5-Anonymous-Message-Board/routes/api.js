/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post((req, res) => {
      // text
      // delete_password

      /*
        saved will be
        _id
        text
        created_on
        bumped_on
        reported
        deleted_password
        replies
      */

      if(!req.body.hasOwnProperty('text')) res.status(400).send(`'text' property is required for this route.`);
      if(!req.body.hasOwnProperty('delete_password')) res.status(400).send(`'delete_password' is required for this route.`);

    });
    
  app.route('/api/replies/:board');

};
