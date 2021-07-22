import * as React from 'react';
import {
    Back,
    Delete,
    Forwards,
    PlaySpeak,
    Rerecord,
    Skip,
    Submit,
} from './keys';

const SpeakKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <PlaySpeak />
            <Skip />
            <Back />
            <Forwards />
            <Rerecord />
            <Delete />
            <Submit />
        </>
    );
};

export default SpeakKeyboard;
