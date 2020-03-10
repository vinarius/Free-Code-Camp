/*
 *
 *
 *       Complete the handler logic below
 *       
 *       
 */

// ?input=4gal
// ?input=1/2km
// ?input=5.4/3lbs
// ?input=kg

function ConvertHandler() {

  this.getNum = function (input) {
    const myRegex = RegExp('[A-Za-z]');
    const splitInput = input.split('');
    let index;
    for (let i = 0; i < splitInput.length; i++) {
      if (myRegex.test(splitInput[i])) {
        index = i;
        break;
      }
    }
    const slicedString = input.slice(0, index);
    if(slicedString.length > 0){

      // ?input= 4/7/8  gal
      // check for decimals, fractions, or both
      // no more than one /
      // no more than one .
      // no other special characters
      let foundOneSlash = false;
      let foundOnePeriod = false;
      const checkForSpecialChars = slicedString.split('');
      for(let i=0; i<checkForSpecialChars.length; i++){
        if(checkForSpecialChars[i] === '/') {
          if(!foundOneSlash) {
            foundOneSlash = true;
          } else {
            return 'invalid number';
          }
        } else if(checkForSpecialChars[i] === '.') {
          if(!foundOnePeriod) {
            foundOnePeriod = true;
          } else {
            return 'invalid number';
          }
        } else if(/\D/.test(checkForSpecialChars[i])) { // check for another non digit character
          return 'invalid number';
        }
      };

      return slicedString;
    } else {
      return '1';
    }
  };

  this.getUnit = function (input) {
    const myRegex = RegExp('[A-Za-z]');
    const splitInput = input.split('');
    let index;
    for (let i = 0; i < splitInput.length; i++) {
      if (myRegex.test(splitInput[i])) {
        index = i;
        break;
      }
    }
    return input.slice(index);
  };

  this.getReturnUnit = function (initUnit) {
    initUnit = initUnit.toLowerCase();

    switch(initUnit) {
      case 'gal':
        return 'l';
      case 'l':
        return 'gal';
      case 'lbs':
        return 'kg';
      case 'kg':
        return 'lbs';
      case 'mi':
        return 'km';
      case 'km':
        return 'mi';
      default:
        throw new Error('invalid unit');
    }
  };

  this.spellOutUnit = function (unit) {
    unit = unit.toLowerCase();

    switch(unit) {
      case 'gal':
        return 'gallons';
      case 'l':
        return 'liters';
      case 'lbs':
        return 'pounds';
      case 'kg':
        return 'kilograms';
      case 'mi':
        return 'miles';
      case 'km':
        return 'kilometers';
      default:
        throw new Error('invalid unit');
    }
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    initNum = parseFloat(initNum);
    let myNumber = 0;
    
    switch(initUnit) {
      case 'gal':

        myNumber = (initNum * galToL).toFixed(6);

        // check if string has a decimal
        if(myNumber.includes('.')) {
          myNumber = myNumber.split('.');
          if(myNumber[1].length > 5) {
            // "3.785412"
            let sixthDigit = `.${myNumber[1].slice(-1)}`;
            sixthDigit = Math.round(+sixthDigit);
            sixthDigit = `0.0000${sixthDigit}`;
            myNumber[1] = +`.${myNumber[1]}`;
            myNumber[1] = myNumber[1].toFixed(5)
            myNumber[1] = +myNumber[1];
            myNumber[1] += +sixthDigit;
            myNumber[1] = String(myNumber[1]).slice(-5);
          }
          myNumber = myNumber.join('.');
        }

        return myNumber;
      case 'l':
        return Math.round((initNum / galToL).toFixed(6));
      case 'lbs':
        return Math.round((initNum * lbsToKg).toFixed(6));
      case 'kg':
        return Math.round((initNum / lbsToKg).toFixed(6));
      case 'mi':
        return Math.round((initNum * miToKm).toFixed(6));
      case 'km':
        return Math.round((initNum / miToKm).toFixed(6));
      default:
        throw new Error('invalid unit');
    }

    return result;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    var result;

    return result;
  };

}

module.exports = ConvertHandler;
