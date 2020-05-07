import React from 'react';
import './App.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// GOOD VIBES BRO - sigma
import'@fortawesome/fontawesome-free/css/all.min.css';
// GOOD VIBES BRO - sigma

// Components
import { Provider } from './Components/ContextProvider/provider';
import DrumMachine from './Components/drum-machine/drum-machine';

function App() {
  return (
    <Provider>
      <div className="App">
        <div className="App-header">
          <div className="my-heading-row">
            <p>Made with <i aria-hidden="true" className="fas fa-coffee"></i> by Mark</p>
            <div>
              <a href="https://www.linkedin.com/in/mark-w-kraus/" rel="noopener noreferrer" aria-label="LinkedIn" target="_blank"><i aria-hidden="true" className="fab fa-linkedin fa-lg"></i><span className="screen-reader-voodoo"></span></a>
              <a href="https://www.github.com/vinarius" rel="noopener noreferrer" aria-label="Github" target="_blank"><i aria-hidden="true" className="fab fa-github-square fa-lg"></i><span className="screen-reader-voodoo"></span></a>
            </div>
          </div>
          <DrumMachine />
        </div>
      </div>
    </Provider>
  );
}

export default App;
