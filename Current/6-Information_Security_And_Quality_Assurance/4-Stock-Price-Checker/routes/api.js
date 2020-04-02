'use strict';

const axios = require('axios');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        const collection = req.app.locals.collection;
        let postOperationsQuery;

        /* 
          _id: ObjectId - unique mongoDB identifier
          stock: string OR array - the *ticker* or tag name of company
          price: string - {
            '1. open': '1114.9800',
            '2. high': '1120.5400',
            '3. low': '1114.9800',
            '4. close': '1119.9224', ** I'm using this in each document
            '5. volume': '21585'
          }
          likes: number - one like per ip address
          priceLastUpdated: string, - last time api was updated
          ipsLiked: string[],
          lastApiCheck: string - last attempt to update from api. They stop updating at 4pm eastern Friday for the weekend.
        */

        // http://localhost:3000/api/stock-prices?stock=goog&stock=msft&like=true
        // req.query: { stock: [ 'goog', 'msft' ], like: 'true' }

        // http://localhost:3000/api/stock-prices?stock=msft&like=true
        // req.query: { stock: 'msft', like: 'true' }

        if (!req.query.hasOwnProperty('stock') || req.query.stock === '' || req.query.stock === ['']) throw new Error(`'stock' property required in request query`);

        if(!Array.isArray(req.query.stock)) req.query.stock = [req.query.stock];

        // Don't query public api if data is in db already. Throttling reasons. 5 requests / min, or 500 / day.
        const checkForExistingDocuments = await collection.find({
          stock: { $in: req.query.stock } // ['msft'] || ['msft', 'aapl']
        }).toArray();

         // if one document or no documents are found
          if (checkForExistingDocuments.length !== req.query.stock.length) {
            postOperationsQuery = updateDatabase(req.query.stock);
          } else {
            // If all documents are matched then
            //  check if at least 1 hour has passed on all documents before hitting api
            const currentTime = new Date().toISOString();
            let dbUpdated = false;
            for(let i=0; i<checkForExistingDocuments.length; i++) {
              let documentLastUpdated = new Date(checkForExistingDocuments[i]['priceLastUpdated']).toISOString();
              if(currentTime > documentLastUpdated) {
                postOperationsQuery = updateDatabase(req.query.stock);
                dbUpdated = true;
                break;
              }
            }

            if(!dbUpdated) postOperationsQuery = checkForExistingDocuments;
          }



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

      async function updateDatabase(symbolsArr) {
        // This public, free api can only be queried one stock symbol at a time.
        // There is no batch read option, so a loop must be used when the user
        // queries against multiple stock symbols.
        const queries = []; // url strings
        const fetchData = []; // result from public api

        let stockApiUrl = `https://www.alphavantage.co/query?`;
        stockApiUrl += `function=TIME_SERIES_INTRADAY`;
        stockApiUrl += `&interval=60min`;
        stockApiUrl += `&apikey=${process.env.apiKey}`;

        symbolsArr.forEach((stock) => {
          let query = stockApiUrl;
          query += `&symbol=${stock}`;
          queries.push(query);
        });

        // Hit alphavantage public api
        for (let i = 0; i < queries.length; i++) {
          const data = await axios.get(queries[i]);
          fetchData.push(data.data);
        };

        // query database to check if the symbol is there already
        // if it exists, update the price and priceLastUpdated
        //  else, insert new document(s)
        const querySymbols = fetchData.map(stockData => stockData['Meta Data']['2. Symbol']); // ['msft', 'aapl'] || ['msft']
        const existingStockInDatabase = await collection.find({
          stock: {
            $in: querySymbols
          }
        }).toArray();

        const existingSymbols = existingStockInDatabase.map(stock => stock.stock);

        // Three scenarios
        // 1. None exist
        // 2. Some exist, some does not
        // 3. All exist

        // Push to one array for inserts on data not existing
        const notExisting = [];
        // Push to second array for updates on data already existing
        const existing = [];

        // Identify what already exists in database
        for (let i = 0; i < querySymbols.length; i++) {
          if (existingSymbols.includes(querySymbols[i])) {

            // { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
            const timeSeries = Object.keys(fetchData[i])[1]; // "Time Series (30min)" || "Time Series (60min)"
            const mostRecentDate = Object.keys(fetchData[i][timeSeries])[0]; // "2020-04-02 15:30:00" 

            const updateOperation = {
              updateOne: {
                filter: {
                  stock: fetchData[i]['Meta Data']['2. Symbol'] // 'msft'
                },
                update: {
                  $set: {
                    price: fetchData[i][timeSeries][mostRecentDate]['4. close'], // '1129.2400'
                    priceLastUpdated: fetchData[i]['Meta Data']['3. Last Refreshed'], // '2020-03-27 14:45:00'
                    lastApiCheck: getCurrentTimeToHour()
                  }
                }
              }
            };

            // If user 'likes' this existing stock
            if (req.query.like === 'true') {
              // If users IP address doesn't already 'like' this stock
              if (!existingStockInDatabase[i]['ipsLiked'].includes(req.ip)) {
                updateOperation['updateOne']['update']['$inc'] = {
                  likes: 1
                };
                updateOperation['updateOne']['update']['$addToSet'] = {
                  ipsLiked: req.ip
                };
              }
            }

            existing.push(updateOperation);
          } else {
            const newDocument = {
              stock: fetchData[i]['Meta Data']['2. Symbol'],
              price: fetchData[i]['Time Series (60min)'][Object.keys(fetchData[i]['Time Series (60min)'])[0]]['4. close'],
              likes: 0,
              priceLastUpdated: fetchData[i]['Meta Data']['3. Last Refreshed'],
              ipsLiked: [],
              lastApiCheck: getCurrentTimeToHour()
            };

            // If user 'likes' this new stock
            if (req.query.like === 'true') {
              newDocument['likes']++;
              newDocument['ipsLiked'].push(req.ip);
            }

            notExisting.push(newDocument);
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
        //       _id: 5e7e4e4f9aa5014a5863b229,
        //       ipsLiked: []
        //     },
        //     {
        //       stock: 'msft',
        //       price: '153.9700',
        //       likes: 0,
        //       priceLastUpdated: '2020-03-27 15:00:00',
        //       _id: 5e7e4e4f9aa5014a5863b22a,
        //       ipsLiked: []
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

        return await collection.find({
          stock: {
            $in: querySymbols
          }
        }).toArray();
      }
    });

};

function getCurrentTimeToHour() {
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();
  const currentDay = currentTime.getDate();
  const currentHour = currentTime.getHours();
  return new Date(currentYear, currentMonth, currentDay, currentHour).toISOString();
}

function getDocumentApiCheckToHour(document) {
  const year = new Date(document['lastApiCheck']).getFullYear();
  const month = new Date(document['lastApiCheck']).getMonth();
  const day = new Date(document['lastApiCheck']).getDate();
  const hours = new Date(document['lastApiCheck']).getHours();
  return new Date(year, month, day, hours).toISOString();
}