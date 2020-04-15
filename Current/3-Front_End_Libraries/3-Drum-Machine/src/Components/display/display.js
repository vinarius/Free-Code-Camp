import React from 'react';
import './display.css';

// Components
import DisplayScreen from "./display-screen/display-screen";
import ToggleButton from "./toggle-button/toggle-button";
import Slider from './slider/slider';

const Display = (props) => {
    return (
        <div id="display">
            <ToggleButton text="Power" state={{state: props.state.state, setState: props.state.setState}} />
            <DisplayScreen />
            <Slider />
            <ToggleButton text="Bank" state={{state: props.state.state, setState: props.state.setState}}/>
        </div>
    );
};

export default Display;