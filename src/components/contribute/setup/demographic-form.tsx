import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';

import {
    DemographicError,
    Demographics,
    Demographic,
} from '../../../types/user';

import {
    setDemographics,
    setTermsConsent
} from '../../../store/user/actions';

import {
    ages,
    genders,
    nativeLanguages,
} from '../../../constants/demographics';

import Info from './information';
import DropdownButton from '../../ui/input/dropdown';
import Checkbox from '../../ui/input/checkbox';
import ShowMore from '../../ui/animated/show-more';
import ConsentForm from './consent-form';

const DemographicContainer = styled.div`
    display: grid;
    gap: 1rem;
    width: 40rem;
    grid-template-columns: 1fr 1fr;


    ${({ theme }) => theme.media.small} {
        width: 100%;        
        grid-template-columns: 1fr;

    }
`;

const Information = styled(Info)`
    grid-column: 1 / 3;
    ${({ theme }) => theme.media.small} {
        grid-column: 1;
    }
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
    background-color: ${({ disabled, theme }) => disabled ? 'gray' : theme.colors.blue};
    color: white;

    cursor: ${({ disabled }) => disabled ? 'initial' : 'pointer'};
    & :active {
        transform: ${({ disabled }) => `translateY(${disabled ? 0 : 2}px)`};
    }

    & span {
        font-size: 0.8rem;
    }

    grid-column: 1 / 3;
    width: 100%;
    max-width: 25rem;
    margin: 0 auto;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;

    }
`;

const AgreeContainer = styled.div`
    display: grid;
    grid-template-columns: 10% auto;
    justify-items: center;
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

const ShowMoreContainer = styled(ShowMore)`
    grid-column: 1 / 3;

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;
    }
`;

const StyledLink = styled.a`
    color: ${({ theme }) => theme.colors.blue};
    :visited, :focus, :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blue};
    }
`;

const dispatchProps = {
    setDemographics,
    setTermsConsent,
}

interface DemographicFormProps {
    onSubmit: () => void;
}

interface State {
    agreed: boolean;
    age: Demographic;
    gender: Demographic;
    nativeLanguage: Demographic;
    showConsentForm: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & DemographicFormProps & typeof dispatchProps;


class DemographicForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            agreed: this.props.user.consents.terms,
            showConsentForm: false,
            ...this.props.user.demographics,
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        const prev = prevProps.user.demographics;
        const now = this.props.user.demographics;
        if (prev != now) {
            this.setState({ ...now });
        }
    }

    handleAgree = () => {
        this.setState({ agreed: !this.state.agreed });
    }

    onAgeSelect = (value: string) => {
        const age = ages.find((val: Demographic) => val.name == value) as Demographic;
        const showConsentForm = !!age && age.id == 'barn';
        this.setState({
            age,
            showConsentForm,
        });
    }

    onGenderSelect = (value: string) => {
        const gender = genders.find((val: Demographic) => val.name == value) as Demographic;
        this.setState({ gender });
    }

    onNativeLanguageSelect = (value: string) => {
        const nativeLanguage = nativeLanguages.find((val: Demographic) => val.name == value) as Demographic;
        this.setState({ nativeLanguage });
    }

    onSubmit = () => {
        const { age, agreed, gender, nativeLanguage } = this.state;
        if (!agreed) {
            return;
        }
        let language;
        if (!!age.name || !!gender.name && !nativeLanguage.name) {
            language = nativeLanguages.find((val: Demographic) => val.id == 'islenska') as Demographic;
        } else {
            language = nativeLanguage;
        }
        this.props.setDemographics({
            age,
            gender,
            nativeLanguage: language,
        });
        this.props.setTermsConsent(true);
        this.props.onSubmit();
    }

    render() {
        const { age, agreed, gender, nativeLanguage, showConsentForm } = this.state;
        return (
            <DemographicContainer>
                <DropdownButton
                    content={ages.map((age: Demographic) => age.name)}
                    label={'Aldur'}
                    onSelect={this.onAgeSelect}
                    selected={age ? age.name : ''}
                />
                <ShowMoreContainer active={showConsentForm}>
                    <ConsentForm visible={showConsentForm} />
                </ShowMoreContainer>
                <DropdownButton
                    content={genders.map((gender: Demographic) => gender.name)}
                    label={'Kyn'}
                    onSelect={this.onGenderSelect}
                    selected={gender ? gender.name : ''}
                />
                <DropdownButton
                    content={nativeLanguages.map((language: Demographic) => language.name)}
                    label={'Móðurmál'}
                    onSelect={this.onNativeLanguageSelect}
                    selected={nativeLanguage.name || 'Íslenska'}
                />
                <Information title={'Hvers vegna skiptir þetta máli?'}>
                    <p>
                        Ofantaldar upplýsingar eru notaðar til að meta hversu lýðfræðilega dreift gagnasafnið Samrómur er. Því dreifðara og fjölbreyttara sem það er, því betra. Sjá skilmála og persónuverndaryfirlýsingu verkefnisins.
                    </p>
                </Information>
                <AgreeContainer>
                    <Checkbox checked={agreed} onChange={this.handleAgree} />
                    <span>Ég staðfesti að hafa kynnt mér <StyledLink href='/skilmalar'>skilmála</StyledLink> og <StyledLink href='/skilmalar'>persónuverndaryfirlýsingu</StyledLink> verkefnisins.</span>
                </AgreeContainer>
                <SubmitButton onClick={this.onSubmit} disabled={!agreed}>Áfram</SubmitButton>
            </DemographicContainer>
        );
    }
}


const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(DemographicForm);