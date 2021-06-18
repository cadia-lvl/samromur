import * as React from 'react';
import { Back, Delete, Forwards, Play, Rerecord, Skip, Submit } from './keys';

const SpeakKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <Play />
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
