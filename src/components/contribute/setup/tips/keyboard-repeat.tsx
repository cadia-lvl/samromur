import * as React from 'react';
import {
    Back,
    Delete,
    Forwards,
    Play,
    PlayRepeat,
    Rerecord,
    Skip,
    Submit,
} from './keys';

const RepeatKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <Play />
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
