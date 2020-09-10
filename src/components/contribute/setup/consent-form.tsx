import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';

import ShowMore from '../../ui/animated/show-more';
import SwipeSwap from '../../ui/animated/swipe';
import TextInput from '../../ui/input/text-input';
import Information from './information';
import { Kennitala, KennitalaType } from './kennitala-validator';

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
    background-color: ${({ disabled, theme }) => disabled ? 'gray' : theme.colors.green};
    color: white;

    cursor: ${({ disabled }) => disabled ? 'initial' : 'pointer'};
    & :active {
        transform: ${({ disabled }) => `translateY(${disabled ? 0 : 2}px)`};
    }

    & span {
        font-size: 0.8rem;
    }
`;

const Instructions = styled.div`
    text-align: center;
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

const dispatchProps = {

}


interface State {
    email: string;
    emailPrompt: boolean;
    error: string;
    kennitala: string;
}

interface ConsentFormProps {
    visible: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & ConsentFormProps & typeof dispatchProps;


class ConsentForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            emailPrompt: false,
            error: '',
            kennitala: ''
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (this.props.visible != prevProps.visible) {
            setTimeout(() => this.setState({
                email: '',
                emailPrompt: false,
                error: '',
                kennitala: '',
            }), 500);
        }
    }

    clearError = () => {
        this.setState({ error: '' });
    }

    onKennitalaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.clearError();
        const kennitala = e.currentTarget.value;
        var lastChar = kennitala.substr(kennitala.length - 1);
        if (kennitala == '' || lastChar.match(/[0-9]/) && kennitala.length <= 10) {
            this.setState({ kennitala });
        }
    }

    onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.clearError();
        const email = e.currentTarget.value;
        this.setState({ email });
    }

    handleSubmit = () => {
        const { email, kennitala } = this.state;
        if (!this.state.emailPrompt) {
            if (!this.validateKennitala(kennitala)) {
                return;
            } else {
                this.setState({ emailPrompt: true });
            }
        } else {
            if (!this.validateEmail(email)) {
                this.setState({ error: 'Ógilt tölvupóstfang' });
            }
        }
    }

    ageFromKennitala = (kennitala: string): number => {
        const day = parseInt(kennitala[0] + kennitala[1]);
        const month = parseInt(kennitala[2] + kennitala[3]);
        const year = parseInt('20' + kennitala[4] + kennitala[5]);
        const birthday = new Date(year, month - 1, day, 0, 0, 0, 0);
        const diffMs = Date.now() - birthday.getTime();
        const ageDate = new Date(diffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age;
    };

    validateKennitala = (kennitala: string): boolean => {
        if (kennitala == '0000000000') {
            return true;
        }
        const valid = Kennitala.Validate(kennitala);
        let error;
        if (valid == KennitalaType.Individual) {
            if (this.ageFromKennitala(kennitala) <= 17) {
                error = 'Kennitala lögráða einstaklings';
            }
        } else {
            error = 'Innslegin kennitala er ógild'
        }
        if (error) {
            this.setState({ error });
            return false;
        } else {
            return true;
        }
    }

    validateEmail = (email: string): boolean => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    };

    render() {
        const { email, emailPrompt, error, kennitala } = this.state;
        const submittable = !emailPrompt ? kennitala.length == 10 : this.validateEmail(email);
        return (
            <ConsentFormContainer>
                <Instructions>
                    Vinsamlegast sláðu inn kennitölu og netfang foreldris/forsjáraðila hér að neðan.
                </Instructions>
                <Error active={!!error} calculate >
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
                        Til þess að uppfylla lög um persónuvernd og vinnslu persónuupplýsinga (90/2018). Við biðjum því börn og unglinga að fá leyfi frá forsjáraðila fyrir þátttöku í Samróm. Unnið verður með þessar upplýsingar í samræmi við skilmála og persónuverndaryfirlýsingu verkefnisins.
                    </p>
                </Info>
            </ConsentFormContainer>
        );
    }
}


const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(ConsentForm);