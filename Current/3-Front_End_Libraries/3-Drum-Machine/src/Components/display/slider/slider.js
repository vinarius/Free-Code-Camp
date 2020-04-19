import React from 'react';
import './slider.css';
// import { Slider } from 'primereact/slider';

function volumeSlider({handleStateChange, ...props}) {
    return (
        <input type="range" defaultValue="75" onChange={(event) => { handleStateChange('volume', event.target.value) }}></input>
        // <div></div>
    );
}

export default volumeSlider;