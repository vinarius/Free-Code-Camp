function telephoneCheck(str) {
    
    let myRegEx = /^((1 )|(1))?((\(\d{3}\))|(\d{3}))\s?\-?\d{3}\s?\-?\d{4}$/;
    
    return myRegEx.test(str);
  }
  
  telephoneCheck("555-555-5555");