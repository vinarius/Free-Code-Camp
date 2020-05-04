import React, { useEffect, useState, useContext } from 'react';
import './drum-machine.css';

// Components
import Display from '../display/display';
// import DrumPad from '../drum-pad/drum-pad';
import { DrumMachineContext } from '../ContextProvider/provider';

// function convertStringToVolumeNumber (string) {
//     let result = string;
//     if(result === '100') {
//         result = 1;
//     } else {
//         result = parseInt(`0.${result}`);
//     }
//     return result;
// }

const DrumMachine = ({handleStateChange, ...props}) => {

    const { isPowerOn, usingBankOne, volume } = useContext(DrumMachineContext);

    const bankOneAudio = new Audio(props.bankOneAudioUrl);
    const bankTwoAudio = new Audio(props.bankTwoAudioUrl);

    useEffect(() => {
        console.log('useEffect fired. Reattaching listeners.');
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    // eslint-disable-next-line
    }, [isPowerOn, usingBankOne, volume]);

    const [isKeyDown, setIsKeyDown] = useState(false);

    const handleKeyDown = (event) => {
        console.log('volume:', volume);
        if(isPowerOn && !isKeyDown) {
            const key = event.key.toLowerCase();
            console.log('key');
            switch (key) {
                case 'q':
                    break;

                case 'a':
                    break;

                case 'z':
                    break;

                case 'w':
                    break;

                case 's':
                    break;

                case 'x':
                    break;

                case 'e':
                    break;

                case 'd':
                    break;

                case 'c':
                    break;

                default:
                    break;
            }
        }


        // if(event.keyCode === props.keyCode && !isKeyDown && isPowerOn) {
        //     setIsKeyDown(true);
        //     // bankOneAudio.volume = convertStringToVolumeNumber(volume);
        //     // bankTwoAudio.volume = convertStringToVolumeNumber(volume);
        //     usingBankOne ? bankOneAudio.play() : bankTwoAudio.play();
        // }
    };

    const handleKeyUp = (event) => {
        if(event.keyCode === props.keyCode) setIsKeyDown(false);
    };

    const drumPads = [
        {
            keyCode: 81,
            id: 'Q',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
        },
        {
            keyCode: 65,
            id: 'A',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
        },
        {
            keyCode: 90,
            id: 'Z',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
        },
        {
            keyCode: 87,
            id: 'W',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'
        },
        {
            keyCode: 83,
            id: 'S',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'
        },
        {
            keyCode: 88,
            id: 'X',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
        },
        {
            keyCode: 69,
            id: 'E',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
        },
        {
            keyCode: 68,
            id: 'D',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'
        },
        {
            keyCode: 67,
            id: 'C',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
        }
    ];

    const handleDrumPadClick = () => {
        console.log('clicked');
    };

    const rows = [];
    let row = [];
    for(let i=0; i<drumPads.length; i++) {
        const drumPad = () => {
            return (
                <div key={i}>
                    <button onClick={handleDrumPadClick} className="drum-pad good-vibes-bro">{drumPads[i].id}</button>
                    <audio className="clip" id={drumPads[i].id} src={usingBankOne ? drumPads[i].bankOneAudioUrl : drumPads[i].bankTwoAudioUrl}></audio>
                </div>
            );
        };

        row.push(drumPad);

        if(i % 3 === 0) {
            rows.push(row);
            row = [];
        }
    }

    return (
        <div id="drum-machine">
            <div id="buttons-wrapper" className={isPowerOn ? "backlight" : ""}>
                {/* <div className="my-row">
                    <DrumPad keyCode={81} id="Q" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3" />
                    <DrumPad keyCode={65} id="A" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3" />
                    <DrumPad keyCode={90} id="Z" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3" />
                </div>
                <div className="my-row">
                    <DrumPad keyCode={87} id="W" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3" />
                    <DrumPad keyCode={83} id="S" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3" />
                    <DrumPad keyCode={88} id="X" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3" />
                </div>
                <div className="my-row">
                    <DrumPad keyCode={69} id="E" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" />
                    <DrumPad keyCode={68} id="D" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3" />
                    <DrumPad keyCode={67} id="C" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3" />
                </div> */}
                {/* {drumPads.map((pad, index) =>
                    <div key={index}>
                        <button onClick={handleDrumPadClick} className={"drum-pad good-vibes-bro"}>{pad.id}</button>
                        <audio className="clip" id={pad.id} src={pad.bankOneAudioUrl}></audio>
                    </div>
                )} */}
                {/* {rows.map((row, index) => {
                    return (
                        <div key={index} className="my-row">
                            {row.map(drumPad => drumPad)}
                        </div>
                    );
                })} */}
                {rows.map(row => row)}
                
            </div>
            <Display handleStateChange={handleStateChange} />
        </div>
    );
};

// return (
//     <div>
//         <button onClick={() => { handleClick() }} className={"drum-pad good-vibes-bro"}>{props.id}</button>
//         <audio className="clip" id={props.id} src={props.bankOneAudioUrl}></audio>
//     </div>
// )

export default DrumMachine;