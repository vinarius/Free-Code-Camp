import stateActions from './stateActions';

export default function(state, action) {
    switch(action.type) {
        case stateActions.TOGGLE_POWER:
            return togglePower(state);
        case stateActions.TOGGLE_AUDIO_BANK:
            return toggleAudioBank(state);
        case stateActions.SET_VOLUME:
            return setVolume(state, action.newVolume);
        default:
            return state;
    }
};

const togglePower = (state) => ({
    ...state,
    isPowerOn: !state.isPowerOn
});

const toggleAudioBank = (state) => ({
    ...state,
    usingBankOne: !state.usingBankOne
});

const setVolume = (state, newVolume) => ({
    ...state,
    volume: newVolume
});