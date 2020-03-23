'use strict';

var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res) {
      try {
        if (!req.query.input) res.status(400).json({
          error: `query parameter 'input' is required`
        });

        var invalidNum = false;
        var invalidUnit = false;

        var input = req.query.input;
        var initNum = convertHandler.getNum(input);
        var initUnit = convertHandler.getUnit(input);
        var returnNum = convertHandler.convert(initNum, initUnit);
        var returnUnit = convertHandler.getReturnUnit(initUnit);

        if(initNum === 'invalid number') invalidNum = true;
        if(returnUnit === 'invalid unit') invalidUnit = true;

        if(invalidNum && invalidUnit) {
          throw new Error('invalid number and unit');
        } else if(invalidNum) {
          throw new Error('invalid number');
        } else if(invalidUnit) {
          throw new Error('invalid unit');
        }

        var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
        return res.json({
          initNum: initNum,
          initUnit: initUnit,
          returnNum: returnNum,
          returnUnit: returnUnit,
          string: toString
        });
      } catch (error) {
        if(error.message === 'invalid number and unit') return res.status(400).send('invalid number and unit');
        if(error.message === 'invalid unit') return res.status(400).send('invalid unit');
        if(error.message === 'invalid number') return res.status(400).send('invalid number');
      }
    });

};
