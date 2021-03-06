'use strict';

const ObjectId = require('mongodb').ObjectID;

module.exports = (app, db) => {

  app.route('/api/issues/:project')
    .get(async (req, res) => {
      try {
        let queryOptions = {
          project: req.params.project
        };

        const reqBody = Object.entries(req.body);
        const reqQuery = Object.entries(req.query);
        
        queryOptions = constructQuery(reqBody, queryOptions);
        queryOptions = constructQuery(reqQuery, queryOptions);

        const dbResult = await db.collection(process.env.collection).find(queryOptions).toArray();

        res.send(dbResult);
      } catch (error) {
        res.send(error.message);
      }
    })

    .post(async (req, res) => {
      try {
        const project = req.params.project;
        const timestamp = new Date();

        const newProject = {
          ...req.body,
          project,
          created_on: timestamp,
          updated_on: timestamp,
          open: true
        };

        if(!req.body.issue_text || !req.body.issue_title || !req.body.created_by) return res.send('Missing required fields. Required fields: issue_title, issue_text, created_by');

        const insertResult = await db.collection(process.env.collection).insertOne(newProject);

        return res.status(200).json(`Issue ${insertResult.ops[0]._id} has been created`);
      } catch (error) {
        return res.status(400).json(error);
      }
    })

    .put(async (req, res) => {
      try {
        const timestamp = new Date();
        
        if(Object.keys(req.body).length === 0) throw new Error(`No request body supplied`);
        if (!req.body._id || !ObjectId.isValid(req.body._id)) throw new Error(`invalid id ${req.body._id}`);

        let updatedFieldSent = false;
        const update = {
          updated_on: timestamp
        };
        const entries = Object.entries(req.body)
        for (let [key, value] of entries) {
          key = key.toLocaleLowerCase();

          if (value === null || value === undefined) continue;

          switch (key) {
            case '_id':
              break;
            case 'issue_title':
            case 'issue_text':
            case 'created_by':
            case 'assigned_to':
            case 'status_text':
              update[key] = value;
              updatedFieldSent = true;
            case 'open':
              if(value == 'false') value = false;
              if(value == 'true') value = true;
              update[key] = value;
              updatedFieldSent = true;
            default:
              break;
          }
        }

        const updateResult = await db.collection(process.env.collection).findOneAndUpdate({
          _id: new ObjectId(req.body._id)
        }, {
          $set: update
        }, {
          returnOriginal: false
        });

        if (updateResult.lastErrorObject.n === 0) return res.send(`could not update ${req.body._id}. Id not found`);

        const returnMessage = updatedFieldSent ? 'successfully updated' : 'no updated field sent';
        return res.status(200).send(returnMessage);
      } catch (error) {
        return res.status(400).send(`could not update ${req.body._id}`);
      }
    })

    .delete(async (req, res) => {
      try {
        if (!req.body._id || !ObjectId.isValid(req.body._id)) throw new Error('_id error');

        const dbResult = await db.collection(process.env.collection).findOneAndDelete({
          _id: new ObjectId(req.body._id)
        });

        if (dbResult.lastErrorObject.n === 0) return res.send('id not found');
        if (dbResult.lastErrorObject.n === 1 && dbResult.ok === 0) return res.send(`could not delete ${req.body._id}`);
        if (dbResult.lastErrorObject.n === 1 && dbResult.ok === 1) return res.send(`deleted ${req.body._id}`);
        return res.send('Unexpected dbResult.');
      } catch (error) {
        return res.status(400).send(error.message);
      }
    });

};

function constructQuery(entries, query) {
  for(let [key, value] of entries) {
    key = key.toLocaleLowerCase();

    switch(key) {
      case 'issue_title':
      case 'issue_text':
      case 'created_by':
      case 'assigned_to':
      case 'status_text':
      case 'created_on':
      case 'open':
        query[key] = value;
      default:
        break;
    }
  }

  return query;
}