import React, { createContext, useReducer } from 'react';
import MyReducer from './reducer';
import stateActions from './stateActions';

export const DrumMachineContext = createContext();

export const Provider = (props) => {

    const defaultState = {
        isPowerOn: true,
        usingBankOne: true,
        volume: 75,
        isKeyDown: false,
        keyPressed: null,
        displayMessage: ''
    };
    const [state, dispatch] = useReducer(MyReducer, defaultState);
    const {
        isPowerOn,
        usingBankOne,
        volume,
        isKeyDown,
        keyPressed,
        displayMessage
    } = state;

    const togglePower = () => {
        dispatch({ type: stateActions.TOGGLE_POWER });
    };

    const toggleAudioBank = () => {
        dispatch({ type: stateActions.TOGGLE_AUDIO_BANK });
    };

    const setVolume = (newVolume) => {
        dispatch({ type: stateActions.SET_VOLUME, newVolume });
    };

    const setIsKeyDown = (value) => {
        dispatch({ type: stateActions.SET_IS_KEY_DOWN, value });
    };

    const setKeyPressed = (newKey) => {
        dispatch({ type: stateActions.SET_KEY_PRESSED, newKey });
    };

    const setDisplayMessage = (newMessage) => {
        dispatch({ type: stateActions.SET_DISPLAY_MESSAGE, newMessage });
    };

    const providerValue = {
        isPowerOn,
        usingBankOne,
        volume,
        isKeyDown,
        keyPressed,
        displayMessage,
        togglePower,
        toggleAudioBank,
        setVolume,
        setIsKeyDown,
        setKeyPressed,
        setDisplayMessage
    };

    return (
        <DrumMachineContext.Provider value={providerValue}>
            {props.children}
        </DrumMachineContext.Provider>
    );
};