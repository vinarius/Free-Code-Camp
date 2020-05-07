import React from 'react';
import './display.css';

// Components
import DisplayScreen from "./display-screen/display-screen";
import ToggleButton from "./toggle-button/toggle-button";
import Slider from './slider/slider';

const Display = ({handleStateChange, ...props}) => {
    return (
        <div id="display">
            <div className="flex-row">
                <ToggleButton state={props.state} handleStateChange={handleStateChange} text="Power" />
                <ToggleButton state={props.state} handleStateChange={handleStateChange} text="Bank" />
            </div>
            <DisplayScreen state={props.state} />
            <Slider state={props.state} handleStateChange={handleStateChange} />
        </div>
    );
};

export default Display;