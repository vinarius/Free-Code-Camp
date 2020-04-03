'use strict';

const axios = require('axios');

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        const collection = req.app.locals.collection;
        let operationsResult;

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
          priceLastUpdated: string, - api timestamp
          ipsLiked: string[],
          lastApiCheck: date - last attempt to update from api. Used to prevent throttling from api.
        */

        // http://localhost:3000/api/stock-prices?stock=goog&stock=msft&like=true
        // req.query: { stock: [ 'goog', 'msft' ], like: 'true' }

        // http://localhost:3000/api/stock-prices?stock=msft&like=true
        // req.query: { stock: 'msft', like: 'true' }

        if (!req.query.hasOwnProperty('stock') || req.query.stock === '' || req.query.stock === ['']) throw new Error(`'stock' property required in request query`);
        if (Array.isArray(req.query.stock) && req.query.stock.length > 2) res.status(400).send('Api is limited to no more than 2 per request due to public api restrictions.');
        if (!Array.isArray(req.query.stock)) req.query.stock = [req.query.stock];

        // Don't query public api if data is in db already. Throttling reasons. 5 requests / min, or 500 / day.
        const existingDocuments = await collection.find({
          stock: {
            $in: req.query.stock
          } // ['msft'] || ['msft', 'aapl']
        }).toArray();

        // if one document or no documents are found
        if (existingDocuments.length !== req.query.stock.length) {
          operationsResult = await updateDatabase(req);
        } else {
          // If all documents are matched then
          //  check if at least 1 hour has passed on all documents before hitting api
          const currentTime = getCurrentTimeToHour();
          let dbUpdated = false;
          for (let i = 0; i < existingDocuments.length; i++) {
            const documentLastUpdated = getDocumentApiCheckToHour(existingDocuments[i]);
            if (currentTime > documentLastUpdated) {
              operationsResult = await updateDatabase(req);
              dbUpdated = true;
              break;
            }
          }

          if (!dbUpdated) operationsResult = existingDocuments;
        }

        const returnResult = {};

        if (operationsResult.length > 1) {
          returnResult.stockData = [];

          const likesOne = operationsResult[0].likes;
          const likesTwo = operationsResult[1].likes;

          delete operationsResult[0].likes;
          delete operationsResult[1].likes;

          operationsResult[0].rel_likes = likesOne - likesTwo;
          operationsResult[1].rel_likes = likesTwo - likesOne;

          returnResult.stockData.push(operationsResult[0]);
          returnResult.stockData.push(operationsResult[1]);
        } else {
          returnResult.stockData = operationsResult[0];
        }

        return res.status(200).send(returnResult);
      } catch (error) {
        return res.status(400).send('Error in get all stock prices: ' + error);
      }
    });
};

async function updateDatabase(req) {
  const symbolsArr = req.query.stock; // ['aapl']
  const collection = req.app.locals.collection;

  // This public, free api can only be queried one stock symbol at a time.
  // There is no batch read option, so a loop must be used when the user
  // queries against multiple stock symbols.
  const queries = []; // url strings
  const resolvedApiData = []; // result from public api
  let apiCounter = 0;

  let stockApiUrl = `https://www.alphavantage.co/query?`;
  stockApiUrl += `function=TIME_SERIES_INTRADAY`;
  stockApiUrl += `&interval=60min`;
  stockApiUrl += `&apikey=${process.env.apiKey}`;

  symbolsArr.forEach((stock) => {
    let query = stockApiUrl;
    query += `&symbol=${stock}`;
    queries.push(query);
  });

  // Hit alphavantage public api per query string in queries array
  for (let i = 0; i < queries.length; i++) {
    const data = await axios.get(queries[i]);
    apiCounter++;
    resolvedApiData.push(data.data);
  };

  // query database to check if the symbol is there already
  // if it exists, update the price and priceLastUpdated
  //  else, insert new document(s)
  const querySymbols = resolvedApiData.map(stockData => stockData['Meta Data']['2. Symbol']); // ['msft', 'aapl'] || ['msft']
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
    const timeSeries = Object.keys(resolvedApiData[i])[1]; // "Time Series (30min)" || "Time Series (60min)"
    const mostRecentDate = Object.keys(resolvedApiData[i][timeSeries])[0]; // "2020-04-02 15:30:00" 
    if (existingSymbols.includes(querySymbols[i])) {

      // Add a bulk write update in the following format:
      // { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }

      const updateOperation = {
        updateOne: {
          filter: {
            stock: resolvedApiData[i]['Meta Data']['2. Symbol'] // 'msft'
          },
          update: {
            $set: {
              price: resolvedApiData[i][timeSeries][mostRecentDate]['4. close'], // '1129.2400'
              priceLastUpdated: resolvedApiData[i]['Meta Data']['3. Last Refreshed'], // '2020-03-27 14:45:00'
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
        stock: resolvedApiData[i]['Meta Data']['2. Symbol'],
        price: resolvedApiData[i][timeSeries][mostRecentDate]['4. close'],
        likes: 0,
        priceLastUpdated: resolvedApiData[i]['Meta Data']['3. Last Refreshed'],
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

  // Result from mongoDB looks like:
  // {
  //   result: { ok: 1, n: 2, opTime: { ts: [Timestamp], t: 55 } },
  //   ops: [
  //     {
  //       stock: 'goog',
  //       price: '1136.4400',
  //       likes: 0,
  //       priceLastUpdated: '2020-03-27 15:00:00',
  //       _id: 5e7e4e4f9aa5014a5863b229,
  //       ipsLiked: [],
  //       lastApiCheck: 
  //     },
  //     {
  //       stock: 'msft',
  //       price: '153.9700',
  //       likes: 0,
  //       priceLastUpdated: '2020-03-27 15:00:00',
  //       _id: 5e7e4e4f9aa5014a5863b22a,
  //       ipsLiked: [],
  //       lastApiCheck: 
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

  console.log('Times api was called:', apiCounter);
  console.log('Timestamp:', new Date());

  return await collection.find({
    stock: {
      $in: querySymbols
    }
  }).toArray();
}

function getCurrentTimeToHour() {
  const currentTime = new Date();
  const currentYear = currentTime.getUTCFullYear();
  const currentMonth = currentTime.getUTCMonth();
  const currentDay = currentTime.getUTCDate();
  const currentHour = currentTime.getUTCHours();
  return new Date(currentYear, currentMonth, currentDay, currentHour);
}

function getDocumentApiCheckToHour(document) {
  const year = new Date(document['lastApiCheck']).getFullYear();
  const month = new Date(document['lastApiCheck']).getMonth();
  const day = new Date(document['lastApiCheck']).getDate();
  const hours = new Date(document['lastApiCheck']).getHours();
  return new Date(year, month, day, hours);
}