function factorialize(num) {
  
    var counter = 1;
    
    for(var i=1; i<=num; i++){
      counter *= i;
      console.log(i, counter);
    }
    
    return counter;
  }
  
  factorialize(5);