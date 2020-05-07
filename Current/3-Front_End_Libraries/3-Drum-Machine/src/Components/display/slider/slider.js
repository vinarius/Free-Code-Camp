import React, { useContext } from 'react';
import './slider.css';
import { DrumMachineContext } from '../../ContextProvider/provider';

const Slider = () => {

    const { setVolume, setDisplayMessage } = useContext(DrumMachineContext);

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        setDisplayMessage(`Volume: ${newVolume}`);
    };

    return (
        <input type="range" defaultValue="75" onChange={(event) => { handleVolumeChange(event.target.value) }}></input>
    );
}

export default Slider;