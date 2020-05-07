import React, { useEffect, useContext } from 'react';
import './drum-machine.css';

// Components
import Display from '../display/display';
import DrumPad from '../drum-pad/drum-pad';
import { DrumMachineContext } from '../ContextProvider/provider';

function convertStringToVolumeNumber (volume) {
    let localString = volume;
    if((+localString) < 10 && (+localString) > 0) return parseFloat(`0.0${localString}`);
    return localString === '100' ? 1 : parseFloat(`0.${localString}`);
}

const DrumMachine = () => {

    const { isPowerOn, usingBankOne, volume, isKeyDown, setIsKeyDown, setKeyPressed, setDisplayMessage } = useContext(DrumMachineContext);

    const drumPads = [
        {
            keyCode: 81,
            id: 'Q',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3',
            audio: new Audio(),
            bankOneDescription: 'Heater 1',
            bankTwoDescription: 'Chord 1'
        },
        {
            keyCode: 65,
            id: 'A',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3',
            audio: new Audio(),
            bankOneDescription: 'Heater 4',
            bankTwoDescription: 'Shaker'
        },
        {
            keyCode: 90,
            id: 'Z',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3',
            audio: new Audio(),
            bankOneDescription: 'Kick n\' Hat',
            bankTwoDescription: 'Punchy Kick'
        },
        {
            keyCode: 87,
            id: 'W',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3',
            audio: new Audio(),
            bankOneDescription: 'Heater 2',
            bankTwoDescription: 'Chord 2'
        },
        {
            keyCode: 83,
            id: 'S',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3',
            audio: new Audio(),
            bankOneDescription: 'Clap',
            bankTwoDescription: 'Open HH'
        },
        {
            keyCode: 88,
            id: 'X',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3',
            audio: new Audio(),
            bankOneDescription: 'Kick',
            bankTwoDescription: 'Side Stick'
        },
        {
            keyCode: 69,
            id: 'E',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3',
            audio: new Audio(),
            bankOneDescription: 'Heater 3',
            bankTwoDescription: 'Chord 3'
        },
        {
            keyCode: 68,
            id: 'D',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3',
            audio: new Audio(),
            bankOneDescription: 'Open HH',
            bankTwoDescription: 'Closed HH'
        },
        {
            keyCode: 67,
            id: 'C',
            bankOneAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
            bankTwoAudioUrl: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3',
            audio: new Audio(),
            bankOneDescription: 'Closed HH',
            bankTwoDescription: 'Snare'
        }
    ];

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    // eslint-disable-next-line
    }, [isPowerOn, usingBankOne, volume]);

    const playAudio = (keyCode) => {
        keyCode = keyCode.toLowerCase();
        const selectedPad = drumPads.find(pad => pad.id.toLowerCase() === keyCode);
        selectedPad.audio.src = usingBankOne ? selectedPad.bankOneAudioUrl : selectedPad.bankTwoAudioUrl;
        selectedPad.audio.volume = convertStringToVolumeNumber(volume);
        selectedPad.audio.play().catch(()=>{});
    };

    const changeDisplayMessage = (keyCode) => {
        keyCode = keyCode.toLowerCase();
        const selectedPad = drumPads.find(pad => pad.id.toLowerCase() === keyCode);
        const newMessage = usingBankOne ? selectedPad.bankOneDescription : selectedPad.bankTwoDescription;
        setDisplayMessage(newMessage);
    };

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
                    setKeyPressed(event.key);
                    changeDisplayMessage(event.key);
                    playAudio(event.key);
                    break;

                default:
                    break;
            }
        }
    };

    const handleKeyUp = () => {
        setIsKeyDown(false);
        setKeyPressed(null);
    };

    const handleClick = (keyCode) => {
        changeDisplayMessage(keyCode);
        playAudio(keyCode);
    };

    const rows = [];
    let row = [];
    for(let i=0; i<drumPads.length; i++) {
        const drumPad = <DrumPad
            handleClick={handleClick}
            key={i}
            keyCode={drumPads[i].keyCode}
            id={drumPads[i].id}
            bankOneAudioUrl={drumPads[i].bankOneAudioUrl}
            bankTwoAudioUrl={drumPads[i].bankTwoAudioUrl}
        ></DrumPad>;

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