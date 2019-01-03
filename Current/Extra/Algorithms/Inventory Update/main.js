window.addEventListener('DOMContentLoaded', () => {


  function updateInventory(_current, _update) {

    /* 
    loop through update
      loop through current
        if current[j].includes(update[i][1]) then
          current[j][0] = current[j][0] += update[i][0]
    */

    let current = _current;
    let update = _update;

    for (let i = 0; i < update.length; i++) {
      for (let j = 0; j < current.length; j++) {
        if (current[j].includes(update[i][1])) {
          current[j][0] = current[j][0] += update[i][0];
          j = current.length - 1;
        }
      }
    }

    let temp = [];
    let delta = [];
    let ix;

    function resetTemp() {
      temp = [];
      current.forEach(el => {
        temp.push(el[1]);
      });
    }

    function resetDelta() {
      delta = [];
      update.forEach(el => {
        delta.push(el[1]);
      });
    }

    resetTemp();
    resetDelta();

    //loop through delta and check if every element is found in temp.
    //  if something is not found then
    //    get the index and push to current

    for (let i = 0; i < delta.length; i++) {
      if (!(temp.includes(delta[i]))) {
        let targetInfoToAdd = delta[i]; //string
        for (let j = 0; j < update.length; j++) {
          if (update[j].includes(targetInfoToAdd)) {
            ix = j;
            current.push(update[ix]);
            temp.push(update[ix][1]);
          }
        }
      }
    }

    current.sort((a, b)=>{
      if(a[1]>b[1]){
        return 1;
      } else {
        return -1;
      }
    });

    return current;
  }

  updateInventory([
    [21, "Bowling Ball"],
    [2, "Dirty Sock"],
    [1, "Hair Pin"],
    [5, "Microphone"]
  ], [
    [2, "Hair Pin"],
    [3, "Half-Eaten Apple"],
    [67, "Bowling Ball"],
    [7, "Toothpaste"]
  ]);
  
  // should
  // return [
  //   [88, "Bowling Ball"],
  //   [2, "Dirty Sock"],
  //   [3, "Hair Pin"],
  //   [3, "Half-Eaten Apple"],
  //   [5, "Microphone"],
  //   [7, "Toothpaste"]
  // ]



  /*
  
    [
      quantity: number,
      item: string
    ]
  
  --------------------
    [0
      [0],
      [1],
      [2],
      [3]
    ],
  
    [1
      [0],
      [1],
      [2],
      [3]
    ]
  --------------------
  
  */

}); //end of doc ready