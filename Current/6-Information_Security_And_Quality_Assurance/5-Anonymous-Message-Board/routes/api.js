'use strict';

const ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(async (req, res) => {
      try {
        const requiredRequestBodyProps = ['text', 'delete_password'];

        for (let i = 0; i < requiredRequestBodyProps.length; i++) {
          if (!req.body.hasOwnProperty(requiredRequestBodyProps[i])) return res.status(400).send(`'${requiredRequestBodyProps[i]}' property is required for this route.`);
        };

        const collection = req.app.locals.collection;
        const timestamp = new Date();
        const newThread = {
          board: req.body.board,
          text: req.body.text,
          created_on: timestamp,
          bumped_on: timestamp,
          reported: false,
          delete_password: req.body.delete_password,
          replies: []
        };

        await collection.insertOne(newThread);

        return res.redirect(301, `/b/${req.body.board}`);
      } catch (error) {
        console.error('error in create new thread:', error);
        return res.status(400).end();
      }
    });

  app.route('/api/replies/:board')
    .post(async (req, res) => {
      try {
        const requiredRequestBodyProps = ['text', 'delete_password', 'thread_id'];

        for (let i = 0; i < requiredRequestBodyProps.length; i++) {
          if (!req.body.hasOwnProperty(requiredRequestBodyProps[i])) return res.status(400).send(`'${requiredRequestBodyProps[i]}' property is required in the request body for this route.`);
        };

        if (!ObjectId.isValid(req.body.thread_id)) return status(400).send(`${req.body.thread_id} is an invalid id`);

        const collection = req.app.locals.collection;
        const newReply = {
          _id: new ObjectId(),
          text: req.body.text,
          delete_password: req.body.delete_password,
          created_on: new Date(),
          reported: false
        };

        const timestamp = new Date();

        await collection.findOneAndUpdate({
          _id: req.body.thread_id
        }, {
          $push: {
            replies: newReply
          },
          $set: {
            bumped_on: timestamp
          }
        });

        return res.redirect(301, `/b/${req.body.board}/${req.body.thread_id}`);
      } catch (error) {
        console.error('Error in post reply to board:', error);
        return res.status(400).end();
      }
    });

};
