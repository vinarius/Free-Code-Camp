import React, { useContext } from 'react';
import './drum-pad.css';
import { DrumMachineContext } from '../ContextProvider/provider';

const DrumPad = (props) => {

    const { usingBankOne, isPowerOn, isKeyDown, keyPressed } = useContext(DrumMachineContext);

    return (
        <div id={`parent-id-${props.id}`}>
            <button onClick={()=>{props.handleClick(props.id)}} className={`drum-pad ${(isKeyDown && keyPressed === props.id.toLowerCase() && isPowerOn) ? "good-vibes-bro" : ""}`}>{props.id}</button>
            <audio className="clip" id={props.id} src={usingBankOne ? props.bankOneAudioUrl : props.bankTwoAudioUrl}></audio>
        </div>
    );
};

export default DrumPad;