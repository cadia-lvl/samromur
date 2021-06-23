import * as React from 'react';
import {
    Back,
    Forwards,
    PlayListen,
    Skip,
    Submit,
    VoteNo,
    VoteYes,
} from './keys';

const VerifyKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <PlayListen />
            <VoteYes />
            <VoteNo />
            <Skip />
            <Back />
            <Forwards />
            <Submit />
        </>
    );
};

export default VerifyKeyboard;
