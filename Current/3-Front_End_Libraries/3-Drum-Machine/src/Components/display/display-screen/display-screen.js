import React, { useContext } from 'react';
import './display-screen.css';
import { DrumMachineContext } from '../../ContextProvider/provider';

function DisplayScreen(props) {

    const { volume } = useContext(DrumMachineContext);

    return (
    <div id="display-screen">Volume: {volume}</div>
    );
}

export default DisplayScreen;