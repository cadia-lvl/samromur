import * as React from 'react';
import { Back, Forwards, Play, Skip, Submit, VoteNo, VoteYes } from './keys';

const VerifyKeyboard: React.FunctionComponent = () => {
    return (
        <>
            <Play />
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
