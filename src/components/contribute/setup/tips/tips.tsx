import * as React from 'react';
import styled from 'styled-components';
import TipsSpeak from './tips-speak';
import TipsVerify from './tips-verify';
import Checkbox from '../../../ui/input/checkbox';
import { connect } from 'react-redux';
import { setSkipTips } from '../../../../store/user/actions';
import { ContributeType } from '../../../../types/contribute';
import { WithTranslation, withTranslation } from '../../../../server/i18n';

const TipsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    ${({ theme }) => theme.media.smallUp} {
        max-width: 40rem;
    }
`;

const SkipButton = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 0.1rem;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.colors.green};
    color: white;

    cursor: pointer;
    & :active {
        transform: translateY(2px);
    }

    & span {
        font-size: 0.8rem;
    }
    width: 100%;
    max-width: 25rem;
    margin: 0 auto;

    ${({ theme }) => theme.media.small} {
        max-width: 100%;
    }
`;

const SkipInFutureContainer = styled.div`
    display: grid;
    grid-template-columns: 10% auto;
    justify-items: flex-start;
    align-items: center;
    & span {
        margin-left: 1rem;
    }

    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;
    }
`;

const dispatchProps = {
    setSkipTips,
};

interface Props {
    onSkip: () => void;
    contributeType: string;
}

interface State {
    checked: boolean;
}

type TipsProps = Props & typeof dispatchProps & WithTranslation;

class Tips extends React.Component<TipsProps, State> {
    constructor(props: TipsProps) {
        super(props);
        this.state = {
            checked: false,
        };
    }

    handleCheckChanged = () => {
        this.setState({ checked: !this.state.checked });
    };

    handleContinue = () => {
        const { checked } = this.state;
        this.props.setSkipTips(checked); // dispatch to store
        this.props.onSkip();
    };

    render() {
        const { contributeType, t } = this.props;
        const { checked } = this.state;
        const isSpeak = contributeType != ContributeType.LISTEN;
        return (
            <TipsContainer>
                {isSpeak ? <TipsSpeak /> : <TipsVerify />}
                <SkipInFutureContainer>
                    <Checkbox
                        checked={checked}
                        onChange={this.handleCheckChanged}
                    />
                    <span>{t('skip-tips')}</span>
                </SkipInFutureContainer>
                <SkipButton onClick={this.handleContinue}>
                    {t('common:continue')}
                </SkipButton>
            </TipsContainer>
        );
    }
}

export default connect(
    null,
    dispatchProps
)(withTranslation(['tips', 'common'])(Tips));
