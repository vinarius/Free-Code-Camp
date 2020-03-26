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

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await db.collection(process.env.collection).deleteMany({});
        return res.status(200).json({text:'complete delete successful'});
      } catch (error) {
        console.log('error in delete all books: ', error);
        return res.status(400).send('Error in delete books collection: ' + error);
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        if (!req.params.hasOwnProperty('id') || !req.params.id) return res.status(400).send(`please send a unique id in the path: /api/books/{bookId}`);
        const queryResult = await db.collection(process.env.collection).find({ _id: new ObjectId(req.params.id)}).toArray();

        if(queryResult.length === 0) return res.status(404).send('no book exists');
        return res.status(200).json(queryResult[0]);
      } catch (error) {
        return res.status(400).send('Error in get book by id: ' + error);
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      try {
        if (!req.params.hasOwnProperty('id') || !req.params.id) return res.status(400).send(`please send a unique id in the path: /api/books/{bookId}`);
        if (!req.body.hasOwnProperty('comment') || !req.body.comment) return res.status(400).send(`please post a comment in the path: /api/books/{bookId}`);

        const updateOperation = await db.collection(process.env.collection).findOneAndUpdate(
          { _id: new ObjectId(req.params.id)},
          {
            $push: { comments: req.body.comment },
            $inc: { commentCount: 1 }
          },
          { returnOriginal: false }
        );

        return res.status(200).json(updateOperation.value);
      } catch (error) {
        return res.status(400).send('Error in post book by id: ' + error);
      }
      //json res format same as .get
    })

    .delete(async function (req, res) {
      //if successful response will be 'delete successful'
      try {
        if (!req.params.hasOwnProperty('id') || !req.params.id) return res.status(400).send(`please send a unique id in the path: /api/books/{bookId}`);
        await db.collection(process.env.collection).deleteOne({_id: new ObjectId(req.params.id)});
        res.status(200).send('delete successful');
      } catch (error) {
        res.status(400).send('Error in delete book by id: ' + error);
      }
    });

};
