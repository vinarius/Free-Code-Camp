import React, { createContext, useReducer } from 'react';
import MyReducer from './reducer';
import stateActions from './stateActions';

export const DrumMachineContext = createContext();

export const Provider = (props) => {

    const defaultState = {
        isPowerOn: true,
        usingBankOne: true,
        volume: 75
    };
    const [state, dispatch] = useReducer(MyReducer, defaultState);
    const {
        isPowerOn,
        usingBankOne,
        volume
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

    const providerValue = {
        isPowerOn,
        usingBankOne,
        volume,
        togglePower,
        toggleAudioBank,
        setVolume
    };

    return (
        <DrumMachineContext.Provider value={providerValue}>
            {props.children}
        </DrumMachineContext.Provider>
    );
};