import React, { useState } from 'react';
import './drum-pad.css';


const DrumPad = (props) => {

    const [isKeyDown, setIsKeyDown] = useState(false);
    const audio = new Audio(props.bankOneAudioUrl);

    const handleKeyDown = (event) => {
        console.log('firing keydown:', props.keyCode);
        if(event.keyCode === props.keyCode && !isKeyDown) {
            setIsKeyDown(true);
            audio.play();
        }
    };

    const handleKeyUp = (event) => {
        if(event.keyCode === props.keyCode) {
            setIsKeyDown(false);
        }
    };

    const handleClick = () => {
        audio.play();
    };

    return (
        <div>
            <button onKeyDown={(event) => { handleKeyDown(event) }} onKeyUp={(event) => { handleKeyUp(event) }} onClick={() => { handleClick() }} className={isKeyDown ? "drum-pad good-vibes-bro" : "drum-pad"}>{props.id}</button>
            <audio className="clip" id={props.id} src={props.bankOneAudioUrl}></audio>
        </div>
    );
};

export default DrumPad;