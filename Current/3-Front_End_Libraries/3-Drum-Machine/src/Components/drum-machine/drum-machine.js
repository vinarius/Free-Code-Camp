import React, { useEffect, useState, useContext } from 'react';
import './drum-machine.css';

// Components
import Display from '../display/display';
import DrumPad from '../drum-pad/drum-pad';
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

const DrumMachine = () => {

    const { isPowerOn, usingBankOne, volume } = useContext(DrumMachineContext);

    // const bankOneAudio = new Audio(props.bankOneAudioUrl);
    // const bankTwoAudio = new Audio(props.bankTwoAudioUrl);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPowerOn, usingBankOne, volume]);

    const [isKeyDown, setIsKeyDown] = useState(false);

    const handleKeyDown = (event) => {
        if(isPowerOn && !isKeyDown) {
            const key = event.key.toLowerCase();
            switch (key) {
                case 'q':
                case 'a':
                case 'z':
                case 'w':
                case 's':
                case 'x':
                case 'e':
                case 'd':
                case 'c':
                    setIsKeyDown(true);
                    handleClick(key);
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

    const handleKeyUp = () => {
        setIsKeyDown(false);
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

    const handleClick = (key) => {
        console.log('key:', key);
    };

    const rows = [];
    let row = [];
    for(let i=0; i<drumPads.length; i++) {
        const drumPad = <DrumPad handleClick={handleClick} key={i} keyCode={drumPads[i].keyCode} id={drumPads[i].id} bankOneAudioUrl={drumPads[i].bankOneAudioUrl} bankTwoAudioUrl={drumPads[i].bankTwoAudioUrl}></DrumPad>;

        row.push(drumPad);

        if((i + 1) % 3 === 0) {
            rows.push(row);
            row = [];
        }
    }

    return (
        <div id="drum-machine">
            <div id="buttons-wrapper" className={isPowerOn ? "backlight" : ""}>
                {rows.map((row, index) => {
                    return (
                        <div key={index} className="my-row">
                            {row.map(drumPad => drumPad)}
                        </div>
                    );
                })}
            </div>
            <Display />
        </div>
    );
};

export default DrumMachine;