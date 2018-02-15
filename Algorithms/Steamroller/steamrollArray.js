function steamrollArray(arr) {
    // I'm a steamroller, baby
    
    var flattened = [].concat.apply([], arr);
    flattened = [].concat.apply([], flattened);
    flattened = [].concat.apply([], flattened);
    
    return flattened;
  }
  
  steamrollArray([1, {}, [3, [[4]]]]);
  