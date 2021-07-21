import * as React from 'react';
import {
    Back,
    Forwards,
    PlayListen,
    Submit,
    VoteNo,
    VoteUnsure,
    VoteYes,
} from './keys';

const VerifyKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <PlayListen />
            <VoteYes />
            <VoteNo />
            <VoteUnsure />
            <Back />
            <Forwards />
            <Submit />
        </>
    );
};

export default VerifyKeyboard;
