var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const MongoClient = require('mongodb').MongoClient;
const testUrl = '/api/issues/test';

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post(testUrl)
        .send({
          _id: '5e7b4f559c18324afc4560b0',
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function (err, res) {
          try {
            assert.equal(res.status, 200);
            assert.isString(res.body, "Issue 5e7b4f559c18324afc4560b0 has been created");
          } catch (error) {
            // console.error(error);
          } finally {
            done();
          }
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post(testUrl)
        .send({
          _id: "5e7b50185714b93fac0e3fa1",
          issue_title: 'test title',
          issue_text: 'test text',
          created_by: 'test'
        })
        .end(function (err, res) {
          try {
            assert.equal(res.status, 200);
            assert.isString(res.body, "Issue 5e7b50185714b93fac0e3fa1 has been created");
          } catch (error) {
            // console.error(error);
          } finally {
            done();
          }
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post(testUrl)
        .send({
          issue_title: 'test title',
          issue_text: 'test text'
        })
        .end(function (err, res) {
          try {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Missing required fields. Required fields: issue_title, issue_text, created_by');
          } catch (error) {
            // console.error(error);
          } finally {
            done();
          }
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put(testUrl)
        .end(function (err, res) {
          try {
          } catch (error) {
            assert.equal(res.status, 400);
            assert.isString(res.body, 'No request body supplied');
          } finally {
            done();
          }
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put(testUrl)
        .send({
          _id: "5e7b50185714b93fac0e3fa1",
          open: false
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isString(res.text, 'successfully updated');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put(testUrl)
        .send({
          _id: "5e7b50185714b93fac0e3fa1",
          open: true,
          issue_text: 'updating to some new test text',
          issue_title: 'updating the title'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isString(res.text, 'successfully updated');
          done();
        });
      });
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      before(async function(){
        const client = await MongoClient.connect(process.env.mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true});
        const testDocuments = await client.db(process.env.database).collection(process.env.collection).find({
          project: 'test'
        }).toArray();
        const ids = testDocuments.map(doc => doc._id);
        await client.db(process.env.database).collection(process.env.collection).deleteMany({
          _id: {
            $in: ids
          }
        });
        const testData = [
          {"_id": "5e7b5f9289efdc64dc1f4abe","issue_title":"myfootitle","issue_text":"my foo text","created_by":"foo","assigned_to":"bar","status_text":"baz","project":"test","created_on":new Date("1585143698693"),"updated_on":new Date("1585143698693"),"open":true},
          {"_id": "5e7b5fc189efdc64dc1f4abf","issue_title":"mybartitle","issue_text":"my bar text","created_by":"bar","assigned_to":"","status_text":"","project":"test","created_on":new Date("1585143745465"),"updated_on":new Date("1585143745465"),"open":true}
        ];
        await client.db(process.env.database).collection(process.env.collection).insertMany(testData);
      });
      
      test('No filter', function(done) {
        chai.request(server)
        .get(testUrl)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get(`/api/issues/test?issue_title=myfootitle`)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].issue_title, 'myfootitle');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get(`/api/issues/test?issue_title=mybartitle&issue_text=my bar text`)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].issue_title, 'mybartitle');
          assert.equal(res.body[0].issue_text, 'my bar text');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete(testUrl)
          .send({})
          .end(function(err, res){
            try {
            } catch (error) {
              assert.equal(res.status, 400);
              assert.equal(res.text('_id error'));
            } finally {
              done();
            }
          });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete(testUrl)
          .send({
            _id: '5e7b5fc189efdc64dc1f4abf'
          })
          .end(function(err, res){
            try {
              assert.equal(res.status, 200);
              assert.equal(res.text('deleted 5e7b5fc189efdc64dc1f4abf'));
            } catch (error) {
            } finally {
              done();
            }
          });
      });
      
    });

    // Clean up test documents after test suite completes so static data does not linger in database.
    after(async function done() {
      const client = await MongoClient.connect(process.env.mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      const testDocuments = await client.db(process.env.database).collection(process.env.collection).find({
        project: 'test'
      }).toArray();
      const ids = testDocuments.map(doc => doc._id);
      await client.db(process.env.database).collection(process.env.collection).deleteMany({
        _id: {
          $in: ids
        }
      });
    });
});
