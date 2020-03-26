/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

chai.use(chaiHttp);

let client;

suite('Functional Tests', function() {
  before(async function() {
    const fakeData = {"_id": new ObjectId("5e7d3c4344098f014c6e2816"),"title":"test static data","comments":[],"commentCount":"0", "testing": true};
    client = await MongoClient.connect(process.env.MONGO_URL, {useUnifiedTopology: true});
    await client.db(process.env.database).collection(process.env.collection).deleteMany({ testing: true });
    await client.db(process.env.database).collection(process.env.collection).insertMany([
      fakeData
    ]);
  });

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentCount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test.skip('Test POST /api/books with title', function(done) {
        //done();
      });
      
      test.skip('Test POST /api/books with no title given', function(done) {
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test.skip('Test GET /api/books',  function(done){
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test.skip('Test GET /api/books/[id] with id not in db',  function(done){
        //done();
      });
      
      test.skip('Test GET /api/books/[id] with valid id in db',  function(done){
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test.skip('Test POST /api/books/[id] with comment', function(done){
        //done();
      });
      
    });

  });

  after(async function(){
    await client.db(process.env.database).collection(process.env.collection).deleteMany({ testing: true });
    await client.disconnect();
  });
});
