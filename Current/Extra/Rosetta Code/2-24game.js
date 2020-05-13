// Rosetta Code: 24 game
// The 24 Game tests a person's mental arithmetic.

// The aim of the game is to arrange four numbers in a way that when evaluated, the result is 24

// Implement a function that takes a string of four digits as its argument, with each digit from 1 to 9 (inclusive) with repetitions allowed, and returns an arithmetic expression that evaluates to the number 24. If no such solution exists, return "no solution exists".

// Rules:
// Only the following operators/functions are allowed: multiplication, division, addition, subtraction.
// Division should use floating point or rational arithmetic, etc, to preserve remainders.
// Forming multiple digit numbers from the supplied digits is disallowed. (So an answer of 12+12 when given 1, 2, 2, and 1 is wrong).
// The order of the digits when given does not have to be preserved.
function doMath(val1, operation, val2) {
    switch(operation) {
      case '+':
        return val1 + val2;
  
      case '-':
        return val1 - val2;
  
      case '*':
        return val1 * val2;
  
      case '/':
        return val1 / val2;
  
      default:
        break;
    }
  }
  
  function executeTestOnValueOrder(valueArrangement, values) {
    const operations = ['+', '-', '*', '/'];
    const valueOne = values[valueArrangement[0]];
    const valueTwo = values[valueArrangement[1]];
    const valueThree = values[valueArrangement[2]];
    const valueFour = values[valueArrangement[3]];
    let result;
  
    for (let i = 0; i < operations.length; i++) {
      for (let j = 0; j < operations.length; j++) {
        for (let k = 0; k < operations.length; k++) {
          result = doMath(valueOne, operations[i], valueTwo);
          result = doMath(result, operations[j], valueThree);
          result = doMath(result, operations[k], valueFour);
  
          if(result === 24) {
            // hacky for the sake of order of ops
            let solution = [];
            solution.push('(');
            solution.push('(');
            solution.push(valueOne);
            solution.push(operations[i]);
            solution.push(valueTwo);
            solution.push(')');
            solution.push(operations[j]);
            solution.push(valueThree);
            solution.push(')');
            solution.push(operations[k]);
            solution.push(valueFour);
            solution = solution.join('');
  
            return {
              result,
              solution
            };
          }
  
        }
      }
    }
  
    return false;
  }
  
  function solve24(input) {
  
    const values = input.split('').map(value => +value);
  
    // Surely there is a better way
    const valueSorting = [
      [0, 1, 2, 3],
      [0, 1, 3, 2],
      [0, 2, 1, 3],
      [0, 2, 3, 1],
      [0, 3, 2, 1],
      [0, 3, 1, 2],
      [1, 0, 2, 3],
      [1, 0, 3, 2],
      [1, 2, 3, 0],
      [1, 2, 0, 3],
      [1, 3, 0, 2],
      [1, 3, 2, 0],
      [2, 0, 1, 3],
      [2, 0, 3, 1],
      [2, 1, 0, 3],
      [2, 1, 3, 0],
      [2, 3, 0, 1],
      [2, 3, 1, 0],
      [3, 0, 1, 2],
      [3, 0, 2, 1],
      [3, 1, 0, 2],
      [3, 1, 2, 0],
      [3, 2, 0, 1],
      [3, 2, 1, 0]
    ];
  
    for (let i = 0; i < valueSorting.length; i++) {
      const test = executeTestOnValueOrder(valueSorting[i], values);
      if(test.result === 24) return test.solution;
    }
  
    return 'No solution found';
  }
  
  solve24('4878');