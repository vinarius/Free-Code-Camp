import React, { useContext } from 'react';
import './slider.css';
import { DrumMachineContext } from '../../ContextProvider/provider';

const Slider = () => {

    const { setVolume } = useContext(DrumMachineContext);

    return (
        <input type="range" defaultValue="75" onChange={(event) => { setVolume(event.target.value) }}></input>
    );
}

export default Slider;