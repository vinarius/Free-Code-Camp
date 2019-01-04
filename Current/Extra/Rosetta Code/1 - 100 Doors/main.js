window.addEventListener('DOMContentLoaded', () => {

  function getFinalOpenedDoors (numDoors) {
  
    let doors = [];
  
    //set all doors to closed
    for(let i=0; i<numDoors; i++){
      doors[i] = false;
    }
  
    function toggleDoor(door){
      door = !door;
    }
  
    for(let i=0; i<doors.length; i++){
      //if door # is divisble by i then
      //  toggleDoor
      //ie if i = 15 then 
  
      let doorsToHit = [];
  
      //setup target doors to toggle for current iteration
      for(let j=0; j<=numDoors; j+=i){
        if(j <= numDoors){
          doorsToHit.push(j);
        }
      }
  
      doorsToHit.forEach((d, i) => {
        toggleDoor(doors[i]);
      });
  
    }
  
    let result = [];
  
    doors.forEach((d, i)=>{
      if(d === true){
        result.push(i); // not sure what exact formatting they are testing for, therefore it will not pass
      }
    });
  
    return result;
  }

}); //end of doc ready