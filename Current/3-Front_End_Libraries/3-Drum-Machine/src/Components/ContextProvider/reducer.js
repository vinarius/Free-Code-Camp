import stateActions from './stateActions';

export default function(state, action) {
    switch(action.type) {
        case stateActions.TOGGLE_POWER:
            return togglePower(state);
        case stateActions.TOGGLE_AUDIO_BANK:
            return toggleAudioBank(state);
        case stateActions.SET_VOLUME:
            return setVolume(state, action.newVolume);
        case stateActions.SET_IS_KEY_DOWN:
            return setIsKeyDown(state, action.value);
        case stateActions.SET_KEY_PRESSED:
            return setKeyPressed(state, action.newKey);
        case stateActions.SET_DISPLAY_MESSAGE:
            return setDisplayMessage(state, action.newMessage);
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

const setIsKeyDown = (state, value) => ({
    ...state,
    isKeyDown: value
});

const setKeyPressed = (state, newKey) => ({
    ...state,
    keyPressed: newKey
});

const setDisplayMessage = (state, newMessage) => ({
    ...state,
    displayMessage: newMessage
});