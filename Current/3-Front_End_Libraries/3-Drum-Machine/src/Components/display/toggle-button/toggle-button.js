import React from 'react';
import './toggle-button.css';

function ToggleButton(props) {
    return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div>{props.text}</div>
        <div className="my-button-toggle-row">
            <div className="active"></div>
            <div className="inactive"></div>
        </div>
    </div>
    );
}

export default ToggleButton;