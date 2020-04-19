import React from 'react';
import './toggle-button.css';

function ToggleButton({handleStateChange, ...props}) {

    const togglePower = () => {
        handleStateChange('isPowerOn', !props.state.isPowerOn);
    };

    const toggleAudioBank = () => {
        handleStateChange('usingBankOne', !props.state.usingBankOne);
    };

    const identifyButtonAndHandleClick = () => {
        switch(props.text) {
            case 'Power':
                togglePower();
                break;
            case 'Bank':
                toggleAudioBank();
                break;
            default:
                break;
        }
    };

    const setButtonClass = (buttonPlacement) => {
        switch(props.text) {
            case 'Power':
                if(props.state.isPowerOn) {
                    return buttonPlacement === 1 ? 'inactive' : 'active';
                } else {
                    return buttonPlacement === 1 ? 'active' : 'inactive';
                }
            case 'Bank':
                if(props.state.usingBankOne) {
                    return buttonPlacement === 1 ? 'inactive' : 'active';
                } else {
                    return buttonPlacement === 1 ? 'active' : 'inactive';
                }
            default:
                break;
        }
    };

    return (
    <div className="toggle-button">
        <div>{props.text}</div>
        <div className="my-button-toggle-row" onClick={identifyButtonAndHandleClick}>
            <div className={setButtonClass(1)}></div>
            <div className={setButtonClass(2)}></div>
        </div>
    </div>
    );
}

export default ToggleButton;