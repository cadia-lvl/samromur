import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';

import * as consentsApi from '../../../services/consents-api';
import { Kennitala, KennitalaType } from './kennitala-validator';

import ShowMore from '../../ui/animated/show-more';
import SwipeSwap from '../../ui/animated/swipe';
import TextInput from '../../ui/input/text-input';
import Information from './information';

import validateEmail from '../../../utilities/validate-email';

import { ageFromKennitala } from '../../../utilities/kennitala-helper';

const ConsentFormContainer = styled.div`
    width: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
    ${({ theme }) => theme.media.small} {
        grid-template-columns: 1fr;
    }
    padding: 0.5rem 0;
    margin-bottom: 2rem;
`;

interface SubmitButtonProps {
    disabled: boolean;
}

const SubmitButton = styled.div<SubmitButtonProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 0.1rem;
    padding: 1rem 2rem;
    background-color: ${({ disabled, theme }) =>
        disabled ? 'gray' : theme.colors.green};
    color: white;

    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
    & :active {
        transform: ${({ disabled }) => `translateY(${disabled ? 0 : 2}px)`};
    }

    & span {
        font-size: 0.8rem;
    }
`;

const Instructions = styled.div`
    display: flex;
    flex-direction: column;
    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;
    }
`;

const Info = styled(Information)`
    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;
    }
`;

const InputFields = styled(SwipeSwap)`
    width: 100%;
`;

const Error = styled(ShowMore)`
    color: ${({ theme }) => theme.colors.red};
    text-align: center;
    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
    }
`;

const dispatchProps = {};

interface State {
    email: string;
    emailPrompt: boolean;
    emailSent: boolean;
    error: string;
    hasConsent: boolean;
    kennitala: string;
}

interface ConsentFormProps {
    onConsent: (kennitala: string) => void;
    visible: boolean;
}

type Props = ReturnType<typeof mapStateToProps> &
    ConsentFormProps &
    typeof dispatchProps;

class ConsentForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            emailPrompt: false,
            emailSent: false,
            error: '',
            hasConsent: false,
            kennitala: '',
        };
    }

    componentDidUpdate = (prevProps: Props) => {
        if (this.props.visible != prevProps.visible) {
            setTimeout(
                () =>
                    this.setState({
                        email: '',
                        emailPrompt: false,
                        error: '',
                        kennitala: '',
                    }),
                500
            );
        }
    };

    clearError = () => {
        this.setState({ error: '' });
    };

    onKennitalaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.clearError();
        const kennitala = e.currentTarget.value;
        var lastChar = kennitala.substr(kennitala.length - 1);
        if (
            kennitala == '' ||
            (lastChar.match(/[0-9]/) && kennitala.length <= 10)
        ) {
            this.setState({ kennitala });
        }
    };

    onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.clearError();
        const email = e.currentTarget.value;
        this.setState({ email });
    };

    handleSubmit = async () => {
        const { email, emailPrompt, emailSent, kennitala } = this.state;
        if (!emailPrompt) {
            if (!this.validateKennitala(kennitala)) {
                return;
            } else {
                const consent = await consentsApi.fetchConsent(kennitala);
                if (consent) {
                    this.props.onConsent(kennitala);
                } else {
                    if (emailSent) {
                        this.setState({
                            error: 'Samþykki hefur ekki verið veitt.',
                        });
                    } else {
                        this.setState({ emailPrompt: true });
                    }
                }
            }
        } else {
            if (!validateEmail(email)) {
                this.setState({ error: 'Ógilt tölvupóstfang' });
            } else {
                consentsApi
                    .sendEmail(kennitala, email)
                    .then(() => {
                        this.setState({
                            emailPrompt: false,
                            emailSent: true,
                        });
                    })
                    .catch((error) => {
                        this.setState({
                            error: 'Villa kom upp við sendingu tölvupósts',
                        });
                    });
            }
        }
    };

    validateKennitala = (kennitala: string): boolean => {
        if (kennitala == '0000000000') {
            return true;
        }
        const valid = Kennitala.Validate(kennitala);
        let error;
        if (valid == KennitalaType.Individual) {
            if (ageFromKennitala(kennitala) > 17) {
                error = 'Kennitala lögráða einstaklings';
            }
        } else {
            error = 'Innslegin kennitala er ógild';
        }
        if (error) {
            this.setState({ error });
            return false;
        } else {
            return true;
        }
    };

    render() {
        const { email, emailPrompt, emailSent, error, kennitala } = this.state;
        const submittable = !emailPrompt
            ? kennitala.length == 10
            : validateEmail(email);
        return (
            <ConsentFormContainer>
                <Instructions>
                    {emailSent ? (
                        <React.Fragment>
                            <span>Tölvupóstur sendur!</span>
                            <span>
                                Þegar leyfi hefur verið gefið má staðfesta
                                kennitöluna hér að neðan.
                            </span>
                        </React.Fragment>
                    ) : (
                        'Vinsamlegast sláðu inn kennitölu og netfang foreldris/forsjáraðila hér að neðan.'
                    )}
                </Instructions>
                <Error active={!!error} calculate>
                    <span>{error}</span>
                </Error>
                <InputFields second={emailPrompt}>
                    <TextInput
                        onChange={this.onKennitalaChange}
                        label={'Kennitala ungmennis'}
                        type="number"
                        value={kennitala}
                    />
                    <TextInput
                        onChange={this.onEmailChange}
                        label={'Tölvupóstfang foreldris'}
                        type="text"
                        value={email}
                    />
                </InputFields>
                <SubmitButton
                    onClick={this.handleSubmit}
                    disabled={!submittable}
                >
                    {emailPrompt ? 'Senda tölvupóst' : 'Staðfesta'}
                </SubmitButton>
                <Info title={'Hvers vegna þarf kennitölu?'}>
                    <p>
                        Til þess að uppfylla lög um persónuvernd og vinnslu
                        persónuupplýsinga (90/2018). Við biðjum því börn og
                        unglinga að fá leyfi frá forsjáraðila fyrir þátttöku í
                        Samróm. Unnið verður með þessar upplýsingar í samræmi
                        við skilmála og persónuverndaryfirlýsingu verkefnisins.
                    </p>
                </Info>
            </ConsentFormContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(ConsentForm);
