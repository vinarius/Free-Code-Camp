import React, { useState } from 'react';
import './App.css';

// GOOD VIBES BRO - sigma
import'@fortawesome/fontawesome-free/css/all.min.css';
// GOOD VIBES BRO - sigma

// Components
import DrumMachine from './Components/drum-machine/drum-machine';

const defaultState = {
  isPowerOn: true,
  usingBankOne: true,
  sliderVolume: 75
};

function App() {
  const [state, setState] = useState(defaultState);
  return (
    <div className="App">
      <div className="App-header">
        <div className="my-heading-row">
          <p>Made with <i aria-hidden="true" className="fas fa-coffee"></i> by Mark</p>
          <a href="https://www.linkedin.com/in/mark-w-kraus/" rel="noopener noreferrer" aria-label="LinkedIn" target="_blank"><i aria-hidden="true" className="fab fa-linkedin fa-lg"></i><span className="screen-reader-voodoo"></span></a>
          <a href="https://www.github.com/vinarius" rel="noopener noreferrer" aria-label="Github" target="_blank"><i aria-hidden="true" className="fab fa-github-square fa-lg"></i><span className="screen-reader-voodoo"></span></a>
        </div>
        <DrumMachine state={{state, setState}}/>
      </div>
    </div>
  );
}

export default App;
