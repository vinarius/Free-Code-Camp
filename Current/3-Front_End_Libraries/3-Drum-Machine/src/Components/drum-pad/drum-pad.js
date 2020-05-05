import React, { useContext } from 'react';
import './drum-pad.css';
import { DrumMachineContext } from '../ContextProvider/provider';

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

    const { usingBankOne, isPowerOn } = useContext(DrumMachineContext);
      
    const handleDrumPadClick = () => {
    //    console.log('drum pad clicked');
    };

    const testing = props.handleClick;

    return (
        <div>
            <button onClick={handleDrumPadClick} className="drum-pad">{props.id}</button>
            <audio className="clip" id={props.id} src={usingBankOne ? props.bankOneAudioUrl : props.bankTwoAudioUrl}></audio>
        </div>
    );
};

export default DrumPad;