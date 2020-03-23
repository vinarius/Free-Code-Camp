  // 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
  function fiboEvenSum(n) {
    // You can do it!
  
    let total = 0;
    let a = 1;
    let b = 2;
    const values = [1, 2];
    let sum = 0;
  
    while(total < n) {
      total = a + b;
      const temp = a;
      a = b;
      b = temp + b;
      values.push(total);
    }
  
    values.forEach((el) => {
      if(el % 2 === 0 && el <= n){
        sum += el;
      }
    });
  
    return sum;
  }
  
  fiboEvenSum(10);