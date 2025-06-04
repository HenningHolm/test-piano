import { writable } from 'svelte/store';

export const pianoStore = writable({
    keysPressed: {},
    currentNote: null,
    midiDevices: [],
});

// Function to press a key
export const pressKey = (note) => {
    pianoStore.update(state => {
        state.keysPressed[note] = true;
        state.currentNote = note;
        return state;
    });
};

// Function to release a key
export const releaseKey = (note) => {
    pianoStore.update(state => {
        delete state.keysPressed[note];
        if (state.currentNote === note) {
            state.currentNote = null;
        }
        return state;
    });
};

// Function to set MIDI devices
export const setMidiDevices = (devices) => {
    pianoStore.update(state => {
        state.midiDevices = devices;
        return state;
    });
};