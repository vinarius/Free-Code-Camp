/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('GET /api/stock-prices => stockData object', function () {

    test('1 stock', function (done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: 'aapl'
        })
        .end(function (err, res) {
          assert.property(res.body, 'stockData');
          assert.isObject(res.body.stockData);
          assert.property(res.body.stockData, '_id');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.property(res.body.stockData, 'priceLastUpdated');
          assert.property(res.body.stockData, 'ipsLiked');
          assert.equal(res.body.stockData.stock, 'aapl');
          done();
        });
    });

    test('1 stock with like', function (done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: 'aapl',
          like: true
        })
        .end(function (err, res) {
          assert.property(res.body, 'stockData');
          assert.isObject(res.body.stockData);
          assert.property(res.body.stockData, '_id');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.property(res.body.stockData, 'priceLastUpdated');
          assert.property(res.body.stockData, 'ipsLiked');
          assert.equal(res.body.stockData.stock, 'aapl');
          assert.equal(res.body.stockData.likes, 1);
          assert.equal(res.body.stockData.ipsLiked.length, 1);
          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', function (done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: 'aapl',
          like: true
        })
        .end(function (err, res) {
          assert.property(res.body, 'stockData');
          assert.isObject(res.body.stockData);
          assert.property(res.body.stockData, '_id');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.property(res.body.stockData, 'priceLastUpdated');
          assert.property(res.body.stockData, 'ipsLiked');
          assert.equal(res.body.stockData.stock, 'aapl');
          assert.equal(res.body.stockData.likes, 1);
          assert.equal(res.body.stockData.ipsLiked.length, 1);
          done();
        });
    });

    test('2 stocks', function (done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({
          stock: ['amzn', 'aapl']
        })
        .end(function (err, res) {
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);

          let isPassing = false;
          let hasAmzn = false;
          let hasAapl = false;

          for (let i = 0; i < res.body.stockData.length; i++) {
            assert.property(res.body.stockData[i], '_id');
            assert.property(res.body.stockData[i], 'stock');
            assert.property(res.body.stockData[i], 'price');
            assert.property(res.body.stockData[i], 'rel_likes');
            assert.property(res.body.stockData[i], 'priceLastUpdated');
            assert.property(res.body.stockData[i], 'ipsLiked');

            if (res.body.stockData[i].stock === 'amzn') hasAmzn = true;
            if (res.body.stockData[i].stock === 'aapl') hasAapl = true;
          }

          if (hasAmzn && hasAapl) isPassing = true;

          assert.equal(isPassing, true, 'Amzn or Aapl not found in response body');
          done();
        });
    });

    test('2 stocks with like', function (done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({
        stock: ['amzn', 'aapl'],
        like: 'true'
      })
      .end(function (err, res) {
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);

        let isPassing = false;
        let hasAmzn = false;
        let hasAapl = false;

        for (let i = 0; i < res.body.stockData.length; i++) {
          assert.property(res.body.stockData[i], '_id');
          assert.property(res.body.stockData[i], 'stock');
          assert.property(res.body.stockData[i], 'price');
          assert.property(res.body.stockData[i], 'rel_likes');
          assert.property(res.body.stockData[i], 'priceLastUpdated');
          assert.property(res.body.stockData[i], 'ipsLiked');

          if (res.body.stockData[i].stock === 'amzn' && res.body.stockData[i].rel_likes === 0 && res.body.stockData[i].ipsLiked.length === 1) hasAmzn = true;
          if (res.body.stockData[i].stock === 'aapl' && res.body.stockData[i].rel_likes === 0 && res.body.stockData[i].ipsLiked.length === 1) hasAapl = true;
        }

        if (hasAmzn && hasAapl) isPassing = true;

        assert.equal(isPassing, true, 'Amzn or Aapl either not found or incorrect rel_likes or incorrect ipsLiked.length in response body');
        done();
      });
    });

  });
});
