/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);
let collection;

suite('Functional Tests', function () {
  before(async function () {
    const client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    collection = client.db(process.env.database).collection(process.env.collection);

    await collection.deleteMany({
      testing: true
    });
  });

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {
      test(`should post a thread to a specific message board by passing form data text and delete_password`, function (done) {
        chai.request(server)
          .post('/api/threads/unit-testing')
          .send({
            text: 'a thread for testing',
            delete_password: 'asdf',
            testing: true
          }).end(async function (err, res) {
            try {
              const newThread = await collection.find({
                board: 'unit-testing',
                text: 'a thread for testing',
                testing: true
              }).toArray();

              assert.property(newThread[0], '_id');
              assert.property(newThread[0], 'created_on');
              assert.property(newThread[0], 'bumped_on');
              assert.equal(newThread[0].text, 'a thread for testing');
              assert.equal(newThread[0].testing, true);
              assert.equal(newThread[0].delete_password, 'asdf');
              assert.equal(newThread[0].board, 'unit-testing');
              assert.equal(newThread[0].reported, false);
              assert.isArray(newThread[0].replies);
              assert.equal(newThread[0].replies.length, 0);
              assert.equal(newThread[0].replyCount, 0);
              assert.equal(res.text, 'success');
              assert.equal(res.status, 200);
            } catch (error) {
              console.error('error:', error);
            } finally {
              done();
            }
          });
      });
    });

    suite('GET', function () {
      test('should get an array of the most recent 10 bumped threads on the board with only the most recent 3 replies', function (done) {

        chai.request(server)
          .get('/api/threads/unit-testing')
          .end(async function (err, res) {
            const parsedData = JSON.parse(res.text);

            assert.isArray(parsedData);
            assert.property(parsedData[0], '_id');
            assert.property(parsedData[0], 'created_on');
            assert.property(parsedData[0], 'bumped_on');
            assert.isAtMost(parsedData.length, 10);
            assert.equal(parsedData[0].text, 'a thread for testing');
            assert.equal(parsedData[0].testing, true);
            assert.notProperty(parsedData[0], 'delete_password');
            assert.notProperty(parsedData[0], 'reported');
            assert.equal(parsedData[0].board, 'unit-testing');
            assert.isArray(parsedData[0].replies);
            assert.equal(parsedData[0].replies.length, 0);
            assert.equal(parsedData[0].replyCount, 0);
            assert.equal(res.status, 200);

            for (let i = 0; i < parsedData.length; i++) {
              assert.isAtMost(parsedData[i].replies.length, 3);
            }

            done();
          });

      });
    });

    suite('DELETE', function () {
      before(async function () {
        const timestamp = new Date();
        const fakeData = {
          "_id": new ObjectId("5e89f4bf7422494e285a92d0"),
          "board": "unit-testing",
          "text": "a thread for deleting",
          "created_on": timestamp,
          "bumped_on": timestamp,
          "reported": false,
          "delete_password": "asdf",
          "replies": [],
          "replyCount": 0,
          "testing": true
        };
        await collection.insertOne(fakeData);
      });

      test('should delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password', function (done) {
        chai.request(server)
          .delete('/api/threads/unit-testing')
          .send({
            thread_id: "5e89f4bf7422494e285a92d0",
            delete_password: 'asdf'
          }).end(async function (err, res) {
            try {
              const deleteQuery = await collection.find({
                _id: new ObjectId("5e89f4bf7422494e285a92d0"),
                board: 'unit-testing',
                text: 'a thread for deleting',
                testing: true
              }).toArray();

              assert.equal(deleteQuery.length, 0);
              assert.equal(res.text, 'success');
              assert.equal(res.status, 200);
            } catch (error) {
              console.error('error:', error);
            } finally {
              done();
            }
          });
      });
    });

    suite('PUT', function () {
      before(async function () {
        const timestamp = new Date();
        const fakeData = {
          "_id": new ObjectId("5e89f6ee6d7b2041140e4cd4"),
          "board": "unit-testing",
          "text": "a thread for deleting",
          "created_on": timestamp,
          "bumped_on": timestamp,
          "reported": false,
          "delete_password": "asdf",
          "replies": [],
          "replyCount": 0,
          "testing": true
        };
        await collection.insertOne(fakeData);
      });

      test(`should report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id`, function (done) {
        chai.request(server)
          .put(`/api/threads/unit-testing`)
          .send({
            thread_id: "5e89f6ee6d7b2041140e4cd4"
          }).end(async function (err, res) {
            const updatedDocument = await collection.find({
              _id: new ObjectId('5e89f6ee6d7b2041140e4cd4')
            }).toArray();
            assert.equal(updatedDocument[0].reported, true);
            done();
          });
      });
    });


  });

  suite('API ROUTING FOR /api/replies/:board', function () {
    let tempDocument;
    before(async function () {
      const timestamp = new Date();
      const fakeData = {
        "_id": new ObjectId("5e89f92c6d7b2041140e4cd5"),
        "board": "unit-testing",
        "text": "a thread for replies",
        "created_on": timestamp,
        "bumped_on": timestamp,
        "reported": false,
        "delete_password": "asdf",
        "replies": [
          {
            _id: new ObjectId('5e89fd2ed5ca4c58e4152e4b'),
            text: 'comment for fake data',
            delete_password: 'asdf',
            created_on: timestamp,
            reported: false
          }
        ],
        "replyCount": 1,
        "testing": true
      };
      const insert = await collection.insertOne(fakeData);
      tempDocument = insert.ops[0];
    });

    suite('POST', function () {
      test('should post a reply to a thread on a specific board by passing form data text, delete_password, & thread_id', function (done) {
        chai.request(server)
          .post('/api/replies/unit-testing')
          .send({
            text: 'testing replies one',
            delete_password: tempDocument.delete_password,
            thread_id: new ObjectId(tempDocument._id)
          }).end(async function (err, res) {
            const threadOfNewReply = await collection.find({
              _id: new ObjectId(tempDocument._id)
            }).toArray();

            assert.isArray(threadOfNewReply[0].replies);
            assert.equal(threadOfNewReply[0].replies.length, 2);
            assert.property(threadOfNewReply[0].replies[1], '_id');
            assert.property(threadOfNewReply[0].replies[1], 'text');
            assert.property(threadOfNewReply[0].replies[1], 'delete_password');
            assert.property(threadOfNewReply[0].replies[1], 'created_on');
            assert.property(threadOfNewReply[0].replies[1], 'reported');
            assert.equal(threadOfNewReply[0].replies[1].text, 'testing replies one');
            assert.equal(threadOfNewReply[0].replies[1].delete_password, 'asdf');
            assert.equal(threadOfNewReply[0].replies[1].reported, false);
            done();
          });
      });
    });

    // suite('GET', function() {

    // });

    suite('PUT', function () {
      test(`should report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id`, function(done) {
        chai.request(server)
          .put('/api/replies/unit-testing')
          .send({
            thread_id: '5e89f92c6d7b2041140e4cd5',
            reply_id: '5e89fd2ed5ca4c58e4152e4b'
          }).end(async function (err, res) {
            const updatedDocument = await collection.find({
              _id: new ObjectId('5e89f92c6d7b2041140e4cd5')
            }).toArray();

            assert.equal(updatedDocument[0].replies[0].reported, true);
            done();
          });
      });
    });

    suite('DELETE', function () {
      test(`should delete a post if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password`, function(done) {
        chai.request(server)
          .delete('/api/replies/unit-testing')
          .send({
            thread_id: '5e89f92c6d7b2041140e4cd5',
            reply_id: '5e89fd2ed5ca4c58e4152e4b',
            delete_password: 'asdf'
          }).end(async function(err, res) {
            const parsedData = JSON.parse(res.text);
            assert.equal(parsedData.response, 'success');
            assert.equal(parsedData.data.ok, 1);
            done();
          });
      });
    });

  });

  suite('API ROUTING FOR /api/replies/{board}/{thread_id}', function () {
    test(`should get an entire thread with all it's replies from /api/replies/{board}/{thread_id}`, function(done) {
      chai.request(server)
        .get('/api/replies/unit-testing/5e89f92c6d7b2041140e4cd5')
        .end(function (err, res) {
          const parsedData = JSON.parse(res.text);

          assert.property(parsedData[0], '_id');
          assert.property(parsedData[0], 'board');
          assert.property(parsedData[0], 'text');
          assert.property(parsedData[0], 'created_on');
          assert.property(parsedData[0], 'bumped_on');
          assert.property(parsedData[0], 'replies');
          assert.property(parsedData[0], 'replyCount');
          assert.property(parsedData[0], 'testing');
          assert.equal(String(parsedData[0]._id), '5e89f92c6d7b2041140e4cd5');
          assert.equal(parsedData[0].board, 'unit-testing');
          assert.equal(parsedData[0].text, 'a thread for replies');
          assert.equal(parsedData[0].replyCount, 1);
          assert.equal(parsedData[0].testing, true);
          assert.isArray(parsedData[0].replies);
          assert.equal(parsedData[0].replies.length, 1);

          done();
        });
    });
  });

  after(async function () {
    await collection.deleteMany({
      testing: true
    });
  });
});
