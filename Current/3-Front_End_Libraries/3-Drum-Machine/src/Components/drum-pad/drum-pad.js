import React, { useState, useEffect } from 'react';
import './drum-pad.css';

function convertStringToVolumeNumber (string) {
    let result = string;
    if(result === '100') {
        result = 1;
    } else {
        result = parseInt(`0.${result}`);
    }
    return result;
}

const DrumPad = (props) => {
      

    const handleClick = () => {
        if(props.state.isPowerOn) {
            console.log('props.state.volume:', props.state.volume);
            // bankOneAudio.volume = convertStringToVolumeNumber(props.state.volume);
            // bankTwoAudio.volume = convertStringToVolumeNumber(props.state.volume);
            props.state.usingBankOne ? bankOneAudio.play() : bankTwoAudio.play();
        }
    };

    return (
        <div>
            <button onClick={() => { handleClick() }} className={isKeyDown ? "drum-pad good-vibes-bro" : "drum-pad"}>{props.id}</button>
            <audio className="clip" id={props.id} src={props.bankOneAudioUrl}></audio>
        </div>
    );
};

export default DrumPad;