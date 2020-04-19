import React from 'react';
import './drum-machine.css';

// Components
import Display from '../display/display';
import DrumPad from '../drum-pad/drum-pad';

function convertStringToVolumeNumber (string) {
    let result = string;
    if(result === '100') {
        result = 1;
    } else {
        result = parseInt(`0.${result}`);
    }
    return result;
}

const DrumMachine = ({handleStateChange, ...props}) => {

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
    }, [props.state.isPowerOn, props.state.usingBankOne, props.state.volume]);

    const [isKeyDown, setIsKeyDown] = useState(false);

    const handleKeyDown = (event) => {
        console.log('props.state.volume:', props.state.volume);
        if(props.state.isPowerOn && !isKeyDown) {
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


        // if(event.keyCode === props.keyCode && !isKeyDown && props.state.isPowerOn) {
        //     setIsKeyDown(true);
        //     // bankOneAudio.volume = convertStringToVolumeNumber(props.state.volume);
        //     // bankTwoAudio.volume = convertStringToVolumeNumber(props.state.volume);
        //     props.state.usingBankOne ? bankOneAudio.play() : bankTwoAudio.play();
        // }
    };

    const handleKeyUp = (event) => {
        if(event.keyCode === props.keyCode) setIsKeyDown(false);
    };

    return (
        <div id="drum-machine" >
            <div id="buttons-wrapper" className={props.state.isPowerOn ? "backlight" : ""}>
                <div className="my-row">
                    <DrumPad state={props.state} keyCode={81} id="Q" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3" />
                    <DrumPad state={props.state} keyCode={65} id="A" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3" />
                    <DrumPad state={props.state} keyCode={90} id="Z" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3" />
                </div>
                <div className="my-row">
                    <DrumPad state={props.state} keyCode={87} id="W" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3" />
                    <DrumPad state={props.state} keyCode={83} id="S" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3" />
                    <DrumPad state={props.state} keyCode={88} id="X" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3" />
                </div>
                <div className="my-row">
                    <DrumPad state={props.state} keyCode={69} id="E" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" />
                    <DrumPad state={props.state} keyCode={68} id="D" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3" />
                    <DrumPad state={props.state} keyCode={67} id="C" bankOneAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" bankTwoAudioUrl="https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3" />
                </div>
            </div>
            <Display state={props.state} handleStateChange={handleStateChange} />
        </div>
    );
};

export default DrumMachine;