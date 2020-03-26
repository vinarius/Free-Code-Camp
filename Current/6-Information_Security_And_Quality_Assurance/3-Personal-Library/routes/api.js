'use strict';

const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = function (app, db) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const queryResult = await db.collection(process.env.collection).find({}).toArray();
        return res.status(200).json(queryResult);
      } catch (error) {
        return res.send('error in get all books: ' + error);
      }
    })

    .post(async function (req, res) {
      try {
        if (!req.body.hasOwnProperty('title') || req.body.title === '') return res.send('Title is required');

        const newBook = {
          title: req.body.title,
          comments: [],
          commentCount: 0
        };

        const dbResult = await db.collection(process.env.collection).insertOne(newBook);

        return res.status(200).json(dbResult.ops[0]);
      } catch (error) {

      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        if (!req.params.hasOwnProperty('id') || !req.params.id) return res.status(400).send(`please send a unique id in the path: /api/books/{bookId}`);
        const queryResult = await db.collection(process.env.collection).find({ _id: new ObjectId(req.params.id)}).toArray();
        return res.status(200).json(queryResult[0]);
      } catch (error) {
        return res.status(400).send('Error in get book by id: ' + error);
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
