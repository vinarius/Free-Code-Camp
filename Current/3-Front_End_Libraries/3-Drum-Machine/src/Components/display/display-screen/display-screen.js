import React, { useContext } from 'react';
import './display-screen.css';
import { DrumMachineContext } from '../../ContextProvider/provider';

function DisplayScreen() {

    const { isPowerOn, displayMessage } = useContext(DrumMachineContext);

    return (
        <div id="display-screen">{isPowerOn ? displayMessage : ''}</div>
    );
}

export default DisplayScreen;