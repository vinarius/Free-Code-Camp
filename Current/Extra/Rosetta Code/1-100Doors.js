// Rosetta Code: 100 doors
// There are 100 doors in a row that are all initially closed. You make 100 passes by the doors. The first time through,
// visit every door and 'toggle' the door (if the door is closed, open it; if it is open, close it). The second time,
// only visit every 2nd door (i.e., door #2, #4, #6, ...) and toggle it. The third time, visit every 3rd door
// (i.e., door #3, #6, #9, ...), etc., until you only visit the 100th door.

// Implement a function to determine the state of the doors after the last pass. Return the final result in an array,
// with only the door number included in the array if it is open.

function getFinalOpenedDoors() {

    const doors = [];
    
    for(let i=1; i<101; i++) {
      doors.push({
        isOpen: false,
        index: i
      });
    }
    
    for(let i=1; i<101; i++) {
      for(let j=i; j<101; j++) {
        if(j % i === 0) {
          doors[(j-1)].isOpen = !doors[(j-1)].isOpen;
        }
      }
    }
    
    return doors.filter(door => door.isOpen)
                .map(door => { 
                    if(door.isOpen) {
                    return door.index;
                    }
                });
    }
    
    getFinalOpenedDoors();

    // [
    //   1,  4,  9, 16,  25,
    //  36, 49, 64, 81, 100
    // ]
