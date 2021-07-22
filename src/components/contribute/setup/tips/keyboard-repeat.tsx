import * as React from 'react';
import {
    Back,
    Delete,
    Forwards,
    PlaySpeak,
    PlayRepeat,
    Rerecord,
    Skip,
    Submit,
} from './keys';

const RepeatKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <PlaySpeak />
            <PlayRepeat />
            <Skip />
            <Back />
            <Forwards />
            <Rerecord />
            <Delete />
            <Submit />
        </>
    );
};

export default RepeatKeyboard;
