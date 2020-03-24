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
        return 'invalid unit';
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
    initUnit = initUnit.toLowerCase();
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    initNum = parseFloat(initNum);
    let output;
    
    switch(initUnit) {
      case 'gal':
        output = initNum * galToL;
        output = output.toFixed(5);
        output = parseFloat(output);
        return output;
      case 'l':
        output = initNum / galToL;
        output = output.toFixed(5);
        output = parseFloat(output);
        return output;
      case 'lbs':
        output = initNum * lbsToKg;
        output = output.toFixed(5);
        output = parseFloat(output);
        return output;
      case 'kg':
        output = initNum / lbsToKg;
        output = output.toFixed(5);
        output = parseFloat(output);
        return output;
      case 'mi':
        output = initNum * miToKm;
        output = output.toFixed(5);
        output = parseFloat(output);
        return output;
      case 'km':
        output = initNum / miToKm;
        output = output.toFixed(5);
        output = parseFloat(output);
        return output;
      default:
        return 'invalid unit';
    }
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const spelledInitUnit = this.spellOutUnit(initUnit);
    const spelledReturnUnit = this.spellOutUnit(returnUnit);
    return `${initNum} ${spelledInitUnit} converts to ${returnNum} ${spelledReturnUnit}`;
    // '3.1 miles converts to 5.00002 kilometers'}
  };

}

module.exports = ConvertHandler;
