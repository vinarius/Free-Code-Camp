/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res) {
      try {
        if (!req.query.input) res.status(400).json({
          error: `query parameter 'input' is required`
        });

        var input = req.query.input;
        var initNum = convertHandler.getNum(input);
        var initUnit = convertHandler.getUnit(input);
        var returnNum = convertHandler.convert(initNum, initUnit);
        var returnUnit = convertHandler.getReturnUnit(initUnit);
        var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
        return res.json({
          initNum: initNum,
          initUnit: initUnit,
          returnNum: returnNum,
          returnUnit: returnUnit,
          string: toString
        });
      } catch (error) {
        if(error === 'invalid number and unit') return res.status(400).send('invalid number and unit');
        if(error === 'invalid unit') return res.status(400).send('invalid unit');
        if(error === 'invalid number') return res.status(400).send('invalid number');
      }
    });

};
