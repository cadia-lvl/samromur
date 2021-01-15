import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';

import {
    DemographicError,
    Demographics,
    Demographic,
    School,
} from '../../../types/user';

import { setDemographics, setTermsConsent } from '../../../store/user/actions';

import {
    ages,
    genders,
    nativeLanguages,
} from '../../../constants/demographics';

import { schools } from '../../../constants/schools';

import Info from './information';
import DropdownButton from '../../ui/input/dropdown';
import Checkbox from '../../ui/input/checkbox';
import ShowMore from '../../ui/animated/show-more';
import ConsentForm from './consent-form';

import { ageFromKennitala } from '../../../utilities/kennitala-helper';

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

interface ConsentMessageProps {
    active: boolean;
}

const ConsentMessage = styled.div<ConsentMessageProps>`
    display: ${({ active }) => (active ? 'flex' : 'none')};
    align-items: center;
    text-decoration: underline;
`;

const Information = styled(Info)`
    grid-column: 1 / 3;
    ${({ theme }) => theme.media.small} {
        grid-column: 1;
    }
`;

const CompetitionText = styled.div`
    margin: auto;
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
        disabled ? 'gray' : theme.colors.blue};
    color: white;

    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
    & :active {
        transform: ${({ disabled }) => `translateY(${disabled ? 0 : 2}px)`};
    }

    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

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
    :visited,
    :focus,
    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blue};
    }
`;

const dispatchProps = {
    setDemographics,
    setTermsConsent,
};

interface DemographicFormProps {
    onSubmit: (age: Demographic, nativeLanguage: Demographic) => void;
}

interface State {
    agreed: boolean;
    age: Demographic;
    gender: Demographic;
    hasConsent: boolean;
    nativeLanguage: Demographic;
    showConsentForm: boolean;
    showSchoolSelection: boolean;
    school: Partial<School>;
    kennitala: string;
}

type Props = ReturnType<typeof mapStateToProps> &
    DemographicFormProps &
    typeof dispatchProps;

class DemographicForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            agreed: this.props.user.consents.terms,
            showConsentForm: false,
            showSchoolSelection: false,
            kennitala: '',
            ...this.props.user.demographics,
        };
    }

    componentDidUpdate = (prevProps: Props) => {
        const prev = prevProps.user.demographics;
        const now = this.props.user.demographics;
        if (prev != now) {
            this.setState({ ...now });
        }
    };

    handleAgree = () => {
        this.setState({ agreed: !this.state.agreed });
    };

    onAgeSelect = (value: string) => {
        const age = ages.find(
            (val: Demographic) => val.name == value
        ) as Demographic;
        const showConsentForm = !!age && age.id == 'barn';
        const showSchoolSelection = !!age && age.id == 'barn';
        this.setState({
            age,
            hasConsent: false,
            showConsentForm,
            showSchoolSelection,
        });
    };

    onConsent = (kennitala: string) => {
        this.setState({ kennitala });
        this.setState({ hasConsent: true });
    };

    onGenderSelect = (value: string) => {
        const gender = genders.find(
            (val: Demographic) => val.name == value
        ) as Demographic;
        this.setState({ gender });
    };

    onNativeLanguageSelect = (value: string) => {
        const nativeLanguage = nativeLanguages.find(
            (val: Demographic) => val.name == value
        ) as Demographic;
        this.setState({ nativeLanguage });
    };

    onSchoolSelect = (value: string) => {
        const school = schools.find(
            (val: School) => val.name == value
        ) as School;
        const schoolDemo: Partial<School> = {
            code: school.code,
            name: school.name,
        };
        this.setState({ school: schoolDemo });
    };

    formIsFilled = (): boolean => {
        const { age, agreed, gender } = this.state;
        return !!age?.name && agreed && !!gender?.name;
    };

    onSubmit = () => {
        const {
            age,
            agreed,
            gender,
            hasConsent,
            nativeLanguage,
            showConsentForm,
            school,
        } = this.state;
        if (!agreed || (showConsentForm && !hasConsent)) {
            return;
        }
        let language;
        if (!!age.name && !!gender.name && !nativeLanguage?.name) {
            language = nativeLanguages.find(
                (val: Demographic) => val.id == 'islenska'
            ) as Demographic;
        } else {
            language = nativeLanguage;
        }
        const demoAge = age.id == 'barn' ? this.getAgeUnder18() : age;
        this.props.setDemographics({
            age: demoAge,
            gender,
            hasConsent: age.id == 'barn' ? hasConsent : false,
            nativeLanguage: language,
            school,
        });
        this.props.setTermsConsent(true);
        this.props.onSubmit(demoAge, language);
    };

    getAgeUnder18 = (): Demographic => {
        const { kennitala } = this.state;
        const age = ageFromKennitala(kennitala).toString();
        return { id: age, name: age };
    };
    // Returns the value to display in the dropdown menu for ages.
    // For demographics not in the contents of the dropdown, under 18 is selected.
    getAgeSelected = (): string => {
        const { age } = this.state;
        if (!age || age.name === '') {
            return '';
        }
        const found = ages.find((item) => item.name === age.name);
        return found ? found.name : ages[0].name;
    };
    render() {
        const {
            agreed,
            gender,
            hasConsent,
            nativeLanguage,
            showConsentForm,
            school,
        } = this.state;
        const formIsFilled = this.formIsFilled();
        const selectedAge = this.getAgeSelected();
        return (
            <DemographicContainer>
                <DropdownButton
                    content={schools
                        .sort((a, b) => a.name.localeCompare(b.name, 'is-IS'))
                        .map((school: School) => school.name)}
                    label={'Skóli'}
                    onSelect={this.onSchoolSelect}
                    selected={school ? (school.name ? school.name : '') : ''}
                />
                <CompetitionText>
                    Lestrarkeppni grunnskólanna hefst 18. janúar!
                </CompetitionText>
                <div />
                <div />
                <DropdownButton
                    content={ages.map((age: Demographic) => age.name)}
                    label={'Aldur'}
                    onSelect={this.onAgeSelect}
                    selected={selectedAge}
                />
                <div></div>
                <ConsentMessage active={hasConsent}>
                    Leyfi staðfest
                </ConsentMessage>
                <ShowMoreContainer active={showConsentForm && !hasConsent}>
                    <ConsentForm
                        onConsent={this.onConsent}
                        visible={showConsentForm}
                    />
                </ShowMoreContainer>
                <DropdownButton
                    content={genders.map((gender: Demographic) => gender.name)}
                    label={'Kyn'}
                    onSelect={this.onGenderSelect}
                    selected={gender ? gender.name : ''}
                />
                <DropdownButton
                    content={nativeLanguages.map(
                        (language: Demographic) => language.name
                    )}
                    label={'Móðurmál'}
                    onSelect={this.onNativeLanguageSelect}
                    selected={nativeLanguage?.name || 'Íslenska'}
                />
                <Information title={'Hvers vegna skiptir þetta máli?'}>
                    <p>
                        Ofantaldar upplýsingar eru notaðar til að meta hversu
                        lýðfræðilega dreift gagnasafnið Samrómur er. Því
                        dreifðara og fjölbreyttara sem það er, því betra. Sjá
                        skilmála og persónuverndaryfirlýsingu verkefnisins hér
                        fyrir neðan til þess að fá frekari upplýsingar.
                    </p>
                </Information>
                <AgreeContainer>
                    <Checkbox checked={agreed} onChange={this.handleAgree} />
                    <span>
                        Ég staðfesti að hafa kynnt mér{' '}
                        <StyledLink href="/skilmalar">skilmála</StyledLink> og{' '}
                        <StyledLink href="/skilmalar">
                            persónuverndaryfirlýsingu
                        </StyledLink>{' '}
                        verkefnisins.
                    </span>
                </AgreeContainer>
                <SubmitButton
                    onClick={this.onSubmit}
                    disabled={!formIsFilled || (showConsentForm && !hasConsent)}
                >
                    Áfram
                </SubmitButton>
            </DemographicContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(DemographicForm);
