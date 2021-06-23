import * as React from 'react';
import KeyboardIcon from '../../../ui/icons/keyboard';
import Tip from './tip';
import styled from 'styled-components';
import { connect } from 'react-redux';
import SpeakKeyboard from './keyboard-speak';
import { RootState } from 'typesafe-actions';
import { ContributeType } from '../../../../types/contribute';
import VerifyKeyboard from './keyboard-verify';
import RepeatKeyboard from './keyboard-repeat';

type Props = ReturnType<typeof mapStateToProps>;

const KeysContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    flex-wrap: wrap;
`;

const TipsKeyboardFC: React.FC<Props> = (props) => {
    const getKeys = () => {
        const { contributeType } = props;
        switch (contributeType) {
            case ContributeType.SPEAK:
                return <SpeakKeyboard />;
            case ContributeType.LISTEN:
                return <VerifyKeyboard />;
            case ContributeType.REPEAT:
                return <RepeatKeyboard />;
            default:
                break;
        }
    };

    return (
        <Tip
            icon={<KeyboardIcon height={40} width={40} fill={'gray'} />}
            title={'Flýtilyklar'}
        >
            <KeysContainer>{getKeys()}</KeysContainer>
        </Tip>
    );
};

const mapStateToProps = (state: RootState) => {
    const {
        contribute: { goal },
    } = state;
    const { contributeType } = { ...goal };
    return { contributeType };
};

export const TipsKeyboard = connect(mapStateToProps)(TipsKeyboardFC);
