import React from 'react';
import './display-screen.css';

function DisplayScreen(props) {
    return (
    <div id="display-screen">Volume: {props.state.volume}</div>
    );
}

export default DisplayScreen;