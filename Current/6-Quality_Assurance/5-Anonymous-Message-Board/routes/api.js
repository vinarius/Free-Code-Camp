'use strict';

const ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {
  app.route('/api/threads/:board')
    // Get an array of the 10 most recently updated threads with only the 3 most recent replies for a specified board
    .get(async (req, res) => {
      const collection = req.app.locals.collection;
      const lastTenThreads = await collection.find({
        board: req.params.board
      }, {
        sort: {
          bumped_on: -1
        }, // results will be ordered by most recent first in array
        limit: 10,
        projection: { // use projection to exclude reported and delete_password props
          reported: 0,
          delete_password: 0,
          replies: {
            $slice: -3
          } // return only the 3 most recent replies
        }
      }).toArray();

      lastTenThreads.forEach((thread) => {
        thread.replies.reverse(); // ensure most recent is listed first
      });

      res.status(200).json(lastTenThreads);
    })
    // Create a new thread on a specified board
    .post(async (req, res) => {
      try {
        const requiredRequestBodyProps = ['text', 'delete_password'];

        for (let i = 0; i < requiredRequestBodyProps.length; i++) {
          if (!req.body.hasOwnProperty(requiredRequestBodyProps[i])) return res.status(400).send(`'${requiredRequestBodyProps[i]}' property is required for this route.`);
        };

        const collection = req.app.locals.collection;

        const queryForBoardName = await collection.find({
          board: req.params.board
        }).toArray();

        if (queryForBoardName.length > 0 && queryForBoardName[0].text === req.body.text) return res.status(400).send(`Thread name ${req.body.text} already exists on board ${req.params.board}. Please choose a unique name.`);

        const timestamp = new Date();
        const newThread = {
          board: req.params.board,
          text: req.body.text,
          created_on: timestamp,
          bumped_on: timestamp,
          reported: false,
          delete_password: req.body.delete_password,
          replies: [],
          replyCount: 0
        };

        if(req.body.hasOwnProperty('testing') && req.body.testing === true) newThread.testing = true;

        await collection.insertOne(newThread);

        return res.status(200).send('success');
        // Express.js - res.redirect uses a deprecated method [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
        // return res.redirect(301, `/b/${req.params.board}`);
      } catch (error) {
        console.error('error in create new thread:', error);
        return res.status(400).end();
      }
    })
    // Report a thread
    .put(async (req, res) => {
      try {
        const requiredBodyParams = ['thread_id'];
        for (let i = 0; i < requiredBodyParams.length; i++) {
          if (!req.body.hasOwnProperty(requiredBodyParams[i])) return res.status(400).send(`'${requiredBodyParams[i]}' is a required property for this route.`);
        }

        const collection = req.app.locals.collection;
        await collection.findOneAndUpdate({
          _id: new ObjectId(req.body.thread_id)
        }, {
          $set: {
            reported: true
          }
        });

        return res.status(200).send('success');
      } catch (error) {
        return res.status(400).send('Error in report thread: ', error);
      }
    })
    // Delete a thread entirely if correct password is passed in
    .delete(async (req, res) => {
      try {
        const requiredBodyParams = ['thread_id', 'delete_password'];
        for (let i = 0; i < requiredBodyParams.length; i++) {
          if (!req.body.hasOwnProperty(requiredBodyParams[i])) return res.status(400).send(`'${requiredBodyParams[i]}' is a required parameter for this route`);
        }

        if (!ObjectId.isValid(req.body.thread_id)) return res.status(400).send(`${req.body.thread_id} is an invalid id`);

        const collection = req.app.locals.collection;
        let thread = await collection.find({
          _id: new ObjectId(req.body.thread_id)
        }).toArray();

        if (thread.length === 0) return res.status(404).send('thread not found');
        thread = thread[0];

        if (thread.delete_password !== req.body.delete_password) return res.status(400).send('incorrect password');

        await collection.deleteOne({
          _id: new ObjectId(req.body.thread_id)
        });

        return res.status(200).send('success');
      } catch (error) {
        return res.status(400).send('Error in delete thread:', error);
      }
    });

  app.route('/api/replies/:board')
    // Create a new reply for a specific thread on a specified board
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
          _id: new ObjectId(req.body.thread_id)
        }, {
          $push: {
            replies: newReply
          },
          $inc: {
            replyCount: 1
          },
          $set: {
            bumped_on: timestamp
          }
        });

        return res.status(200).json({
          response: 'success',
          thread_id: req.body.thread_id,
          board: req.params.board
        });
        // Express.js - res.redirect uses a deprecated method [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
        // return res.redirect(301, `/b/${req.params.board}/${req.body.thread_id}`);
      } catch (error) {
        console.error('Error in post reply to board:', error);
        return res.status(400).end();
      }
    })
    // Report a reply
    .put(async (req, res) => {
      try {
        const requiredBodyParams = ['thread_id', 'reply_id'];
        for (let i = 0; i < requiredBodyParams.length; i++) {
          if (!req.body.hasOwnProperty(requiredBodyParams[i])) return res.status(400).send(`'${requiredBodyParams[i]}' is a required property for this route.`);
        }

        const collection = req.app.locals.collection;

        // Check if thread exists
        const threadQuery = await collection.find({
          _id: new ObjectId(req.body.thread_id)
        }).toArray();
        if (threadQuery.length === 0) return res.status(404).send(`Thread ${req.body.thread_id} not found`);

        // Check if reply exists
        const replyArr = threadQuery[0].replies.filter(reply => String(reply._id) === String(req.body.reply_id));
        if (replyArr.length === 0) return res.status(404).send(`Reply ${req.body.reply_id} not found`);

        // Update reply
        await collection.findOneAndUpdate({
          _id: new ObjectId(req.body.thread_id),
          'replies._id': new ObjectId(req.body.reply_id)
        }, {
          $set: {
            'replies.$.reported': true
          }
        })

        return res.status(200).send('success');
      } catch (error) {
        return res.status(400).send('Error in report reply:', error);
      }
    })
    // Delete a specific reply by id
    .delete(async (req, res) => {
      try {
        const requiredBodyParams = ['thread_id', 'reply_id', 'delete_password'];
        for (let i = 0; i < requiredBodyParams.length; i++) {
          if (!req.body.hasOwnProperty(requiredBodyParams[i])) return res.status(400).send(`'${requiredBodyParams[i]}' is a required property for this route.`);
        }

        const collection = req.app.locals.collection;

        const queryForDocument = await collection.find({
          _id: new ObjectId(req.body.thread_id)
        }).toArray();
        if (queryForDocument.length === 0) return res.status(404).send(`Thread id ${req.body.thread_id} not found`);

        const reply = queryForDocument[0].replies.filter((el) => {
          return String(el._id) === String(req.body.reply_id)
        });

        if (reply.length === 0) return res.status(404).send(`Reply id ${req.body.reply_id} not found`);
        if (reply[0].delete_password !== req.body.delete_password) return res.status(400).send('incorrect password');

        const deleteReplyOperation = await collection.findOneAndUpdate({
          _id: new ObjectId(req.body.thread_id)
        }, {
          $pull: {
            replies: {
              _id: new ObjectId(req.body.reply_id)
            }
          },
          $inc: {
            replyCount: -1
          }
        });

        return res.status(200).json({
          response: 'success',
          data: deleteReplyOperation
        });
      } catch (error) {
        return res.status(400).send('Error in delete reply by id: ', error);
      }
    });

  app.route('/api/replies/:board/:threadId')
    // Get an entire thread with all its replies
    .get(async (req, res) => {
      try {
        if (!ObjectId.isValid(req.params.threadId)) return res.status(400).send(`${req.params.threadId} is an invalid id`);

        const collection = req.app.locals.collection;
        const thread = await collection.find({
          _id: new ObjectId(req.params.threadId)
        }, {
          projection: {
            delete_password: false,
            reported: false
          }
        }).toArray();

        return res.status(200).json(thread);
      } catch (error) {
        return res.status(400).json({
          error: `error in get all thread replies: ${error}`
        });
      }
    });
};
