'use strict';

const axios = require('axios');

module.exports = function (app, collection) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        let stockApiUrl = `https://www.alphavantage.co/query?`;
        stockApiUrl += `function=TIME_SERIES_INTRADAY`;
        stockApiUrl += `&interval=5min`;
        stockApiUrl += `&apikey=${process.env.apiKey}`;

        // get user ip address to validate one 'like' per stock per person
        const userIp = req.ip;

        console.log('userIp:', userIp);

        // This public api can only be queried one stock symbol at a time.
        // There is no batch read option, so a loop must be used when the user
        // queries against multiple stock symbols.
        const queries = []; // url strings
        const fetchData = []; // result from public api

        /* 
          _id: ObjectId - unique mongoDB identifier
          stock: string OR array - the *ticker* or tag name of company
          price: string - {
            '1. open': '1114.9800',
            '2. high': '1120.5400',
            '3. low': '1114.9800',
            '4. close': '1119.9224',
            '5. volume': '21585'
          }
          likes: number - one like per ip address
          priceLastUpdated: string
        */

        // http://localhost:3000/api/stock-prices?stock=goog&stock=msft&like=true
        // req.query: { stock: [ 'goog', 'msft' ], like: 'true' }

        // http://localhost:3000/api/stock-prices?stock=msft&like=true
        // req.query: { stock: 'msft', like: 'true' }

        if (!req.query.hasOwnProperty('stock') || req.query.stock === '' || req.query.stock === ['']) throw new Error(`'stock' property required in request query`);

        if (Array.isArray(req.query.stock)) {
          // req.query.stock is an array
          req.query.stock.forEach((stock) => {
            let query = stockApiUrl;
            query += `&symbol=${stock}`;
            queries.push(query);
          });
        } else {
          // req.query.stock is a string
          let query = stockApiUrl;
          query += `&symbol=${req.query.stock}`;
          queries.push(query);
        }

        // Hit alphavantage public api
        for (let i = 0; i < queries.length; i++) {
          const data = await axios.get(queries[i]);
          fetchData.push(data.data);
        };

        // query our database to check if the symbol is there already
        // if it exists, update the price and priceLastUpdated
        //  else, insert new document(s)
        const initialQuerySymbols = fetchData.map(stockData => stockData['Meta Data']['2. Symbol']);
        const existingStockInDatabase = await collection.find({
          stock: {
            $in: initialQuerySymbols
          }
        }).toArray();

        const existingSymbols = existingStockInDatabase.map(stock => stock.stock);

        // Three scenarios
        // 1. None exist
        // 2. Some exists, some does not exist
        // 3. All exist

        // Push to one array for inserts on data not existing
        const notExisting = [];
        // Push to second array for updates on data already existing
        const existing = [];

        // Identify what already exists in database using .includes
        for (let i = 0; i < initialQuerySymbols.length; i++) {
          if (existingSymbols.includes(initialQuerySymbols[i])) {
            // { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
            const updateOperation = {
              updateOne: {
                filter: {
                  stock: fetchData[i]['Meta Data']['2. Symbol'] // 'goog'
                },
                update: {
                  $set: {
                    price: fetchData[i]['Time Series (5min)'][Object.keys(fetchData[i]['Time Series (5min)'])[0]]['4. close'], // '1129.2400'
                    priceLastUpdated: fetchData[i]['Meta Data']['3. Last Refreshed'] // '2020-03-27 14:45:00'
                  }
                }
              }
            };

            existing.push(updateOperation);
          } else {
            notExisting.push({
              stock: fetchData[i]['Meta Data']['2. Symbol'],
              price: fetchData[i]['Time Series (5min)'][Object.keys(fetchData[i]['Time Series (5min)'])[0]]['4. close'],
              likes: 0,
              priceLastUpdated: fetchData[i]['Meta Data']['3. Last Refreshed'],
              ipsLiked: []
            });
          }
        }

        // InsertMany operation for notExisting documents
        if (notExisting.length > 0) await collection.insertMany(notExisting);

        // bulkInsertOperation: {
        //   result: { ok: 1, n: 2, opTime: { ts: [Timestamp], t: 55 } },
        //   ops: [
        //     {
        //       stock: 'goog',
        //       price: '1136.4400',
        //       likes: 0,
        //       priceLastUpdated: '2020-03-27 15:00:00',
        //       _id: 5e7e4e4f9aa5014a5863b229
        //     },
        //     {
        //       stock: 'msft',
        //       price: '153.9700',
        //       likes: 0,
        //       priceLastUpdated: '2020-03-27 15:00:00',
        //       _id: 5e7e4e4f9aa5014a5863b22a
        //     }
        //   ],
        //   insertedCount: 2,
        //   insertedIds: { '0': 5e7e4e4f9aa5014a5863b229, '1': 5e7e4e4f9aa5014a5863b22a }
        // }

        // BulkWrite operation for existing documents
        if (existing.length > 0) await collection.bulkWrite(existing);

        // bulkWriteOperation: BulkWriteResult {
        //   result: {
        //     ok: 1,
        //     writeErrors: [],
        //     writeConcernErrors: [],
        //     insertedIds: [],
        //     nInserted: 0,
        //     nUpserted: 0,
        //     nMatched: 2,
        //     nModified: 0,
        //     nRemoved: 0,
        //     upserted: [],
        //     lastOp: { ts: [Timestamp], t: 55 }
        //   },
        //   insertedCount: 0,
        //   matchedCount: 2,
        //   modifiedCount: 0,
        //   deletedCount: 0,
        //   upsertedCount: 0,
        //   upsertedIds: {},
        //   insertedIds: {},
        //   n: 0
        // }

        const postOperationsQuery = await collection.find({
          stock: {
            $in: initialQuerySymbols
          }
        }).toArray();

        const returnResult = {};

        if (postOperationsQuery.length > 1) {
          returnResult.stockData = [];

          const likesOne = postOperationsQuery[0].likes;
          const likesTwo = postOperationsQuery[1].likes;

          delete postOperationsQuery[0].likes;
          delete postOperationsQuery[1].likes;

          postOperationsQuery[0].rel_likes = likesOne - likesTwo;
          postOperationsQuery[1].rel_likes = likesTwo - likesOne;

          returnResult.stockData.push(postOperationsQuery[0]);
          returnResult.stockData.push(postOperationsQuery[1]);
        } else {
          returnResult.stockData = postOperationsQuery[0];
        }

        return res.status(200).send(returnResult);
      } catch (error) {
        return res.status(400).send('Error in get all stock prices: ' + error);
      }
    });

};