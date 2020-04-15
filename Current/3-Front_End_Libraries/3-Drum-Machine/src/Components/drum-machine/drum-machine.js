import React from 'react';
import './drum-machine.css';

// Components
import Display from '../display/display';
import DrumPad from '../drum-pad/drum-pad';

const DrumMachine = (props) => {
    return (
        <div id="drum-machine">
            <div id="buttons-wrapper">
                <div className="my-row">
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
                </div>
            </div>
            <Display state={{state: props.state.state, setState: props.state.setState}} />
        </div>
    );
};

export default DrumMachine;