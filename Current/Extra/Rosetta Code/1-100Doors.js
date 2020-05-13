function getFinalOpenedDoors() {

    const doors = [];
    
    for(let i=1; i<101; i++) {
      doors.push({
        isOpen: false,
        index: i
      });
    }
    
    for(let i=1; i<101; i++) {
      for(let j=1; j<101; j++) {
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