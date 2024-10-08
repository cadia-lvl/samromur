import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

import {
    DemographicError,
    Demographics,
    Demographic,
    School,
} from '../../../types/user';

import {
    setDemographics,
    resetDemographics,
    setTermsConsent,
} from '../../../store/user/actions';

import {
    ages,
    genders,
    nativeLanguages,
    icelandicProficiencies,
} from '../../../constants/demographics';

import { schools } from '../../../constants/schools';

import Info from './information';
import DropdownButton from '../../ui/input/dropdown';
import Checkbox from '../../ui/input/checkbox';
import ShowMore from '../../ui/animated/show-more';
import ConsentForm from './consent-form';

import * as authApi from '../../../services/auth-api';
import { pages } from '../../../constants/paths';
import { ageFromKennitala } from '../../../utilities/kennitala-helper';
import moment from 'moment';
import { WithTranslation, withTranslation } from '../../../server/i18n';
import Link from 'next/link';
import {
    isCompetition,
    isCompetitionOver,
} from '../../../utilities/competition-helper';
import { Institution } from '../../../types/institution';
import { getCompanies, getSchools } from '../../../services/competition-api';
import { isCaptini, isL2, isParallel } from '../../../utilities/subpage-helper';
import { CaptiniSignInHello } from '../../subpages/captini-sign-in-hello';
import { ParallelSignInHello } from '../../subpages/parallel-sign-in-hello';
import { L2SignInHello } from '../../subpages/l2-sign-in-hello';

const Container = styled.div``;

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

interface ConsentContainerProps {
    active: boolean;
    isCompetition?: boolean;
}

const ConsentMessage = styled.div`
    display: flex;
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
    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        grid-row: 1;
    }
`;

interface SubmitButtonProps {
    disabled: boolean;
}

const SubmitButton = styled.button<SubmitButtonProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1.1rem;
    border: none;
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

const ConsentAndSwitchUserContainer = styled.div<ConsentContainerProps>`
    display: ${({ active }) => (active ? 'flex' : 'none')};
    flex-direction: row;
    justify-content: space-between;
    ${({ isCompetition }) =>
        isCompetition &&
        `grid-column: 2;
        grid-row: 3;`}

    ${({ theme }) => theme.media.small} {
        grid-column: 1;
        max-width: 100%;
    }
`;

const SwitchUser = styled.div`
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;
    padding: 0.5rem;
    border-radius: 0.1rem;
    cursor: pointer;

    :active {
        transform: translateY(2px);
    }
`;

const dispatchProps = {
    setDemographics,
    resetDemographics,
    setTermsConsent,
};

interface DemographicFormProps {
    onSubmit: (
        age: Demographic,
        nativeLanguage: Demographic,
        institution?: string
    ) => void;
}

interface State {
    agreed: boolean;
    age: Demographic;
    gender: Demographic;
    hasConsent: boolean;
    nativeLanguage: Demographic;
    showConsentForm: boolean;
    showSchoolSelection: boolean;
    institution: Demographic;
    kennitala: string;
    institutions: Institution[];
    icelandicProficiency: Demographic;
}

type Props = ReturnType<typeof mapStateToProps> &
    DemographicFormProps &
    WithTranslation &
    typeof dispatchProps;

class DemographicForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            agreed: this.props.user.consents.terms,
            showConsentForm: false,
            showSchoolSelection: false,
            kennitala: '',
            institutions: [],
            ...this.props.user.demographics,
        };
    }

    componentDidMount = async () => {
        // Set institution to empty values if
        // not competition and there is a value
        const now = this.props.user.demographics;
        if (!isCompetition()) {
            if (now.institution?.id != '') {
                this.setState({ institution: { id: '', name: '' } });
            }
        }

        // Only fetch institutions during competition
        if (isCompetition()) {
            const institutions = await getSchools();
            this.setState({ institutions: institutions });
        }
    };

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
        const { t } = this.props;
        const gender = genders.find(
            (val: Demographic) => t(val.name) == value
        ) as Demographic;
        this.setState({ gender });
    };

    onNativeLanguageSelect = (value: string) => {
        const { t } = this.props;
        const nativeLanguage = nativeLanguages.find(
            (val: Demographic) => t(val.name) == value
        ) as Demographic;
        // if native language is Icelandic, set proficiency to native
        if (!!nativeLanguage && nativeLanguage.id == 'islenska') {
            this.setState({
                icelandicProficiency: icelandicProficiencies.find(
                    (val: Demographic) => val.id == 'native'
                ) as Demographic,
            });
        }
        this.setState({
            nativeLanguage,
        });
    };

    onIcelandicProficiencySelect = (value: string) => {
        const { t } = this.props;
        const icelandicProficiency = icelandicProficiencies.find(
            (val: Demographic) => t(val.name) == value
        ) as Demographic;
        this.setState({ icelandicProficiency });
    };

    // onSchoolSelect = (value: string) => {
    //     const school = schools.find(
    //         (val: School) => val.name == value
    //     ) as School;
    //     const schoolDemo: Partial<School> = {
    //         code: school ? school.code : '',
    //         name: school ? school.name : '',
    //     };
    //     this.setState({ school: schoolDemo });
    // };

    onInstitutionSelect = (value: string) => {
        if (value == '') {
            this.setState({ institution: { id: '', name: '' } });
            return;
        }

        const { institutions } = this.state;
        const i = institutions.find((e) => e.name == value);

        // If selected institution is found, set it to state
        if (i) {
            this.setState({ institution: { id: i.id, name: i.name } });
        }
    };

    formIsFilled = (): boolean => {
        const { age, agreed, gender } = this.state;
        return !!age?.name && agreed && !!gender?.name;
    };

    switchUser = async () => {
        const { user } = this.props;
        this.clearDemographics();
        if (user.client.isAuthenticated) {
            await authApi.logoutRedirectTo(pages.login);
        }
    };

    clearDemographics = () => {
        const { resetDemographics } = this.props;
        const empty = { id: '', name: '' };
        this.setState({
            age: empty,
            agreed: false,
            gender: empty,
            hasConsent: false,
            nativeLanguage: empty,
            icelandicProficiency: empty,
            showConsentForm: false,
        });
        resetDemographics();
    };

    onSubmit = () => {
        const {
            age,
            agreed,
            gender,
            hasConsent,
            nativeLanguage,
            showConsentForm,
            institution,
            icelandicProficiency,
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
            icelandicProficiency,
            institution,
        });
        this.props.setTermsConsent(true);
        this.props.onSubmit(demoAge, language, institution?.id);
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

    getCompetitionText = (): string => {
        // const startDate = moment('2021-01-18 15:00:00', moment.ISO_8601);
        // const endDate = moment('2021-01-26 00:00:00', moment.ISO_8601);
        // const now = moment();
        // if (now.isBetween(startDate, endDate, 'seconds')) {
        //     return 'Lestrarkeppni grunnsskóla er farin af stað!';
        // } else if (now.isAfter(endDate, 'seconds')) {
        //     return 'Lestrarkeppni grunnsskóla er búin.';
        // } else if (now.isBefore(startDate, 'seconds')) {
        //     return 'Lestrarkeppni grunnskólanna hefst 18. janúar klukkan 15.00!';
        // }
        // return '';
        if (isCompetition()) {
            return 'Lestrarkeppni grunnsskóla er farin af stað!';
        }

        // if (!isCompetitionOver()) {
        //     return 'Sérðu ekki vinnustaðinn þinn? skráðu þig ';
        // }
        return '';
    };

    isAuthenticated = (): boolean => {
        const { user } = this.props;
        return user.client.isAuthenticated;
    };

    render() {
        const {
            agreed,
            gender,
            hasConsent,
            nativeLanguage,
            icelandicProficiency,
            showConsentForm,
            institution,
            institutions,
        } = this.state;
        const formIsFilled = this.formIsFilled();
        const selectedAge = this.getAgeSelected();
        const competitionText = this.getCompetitionText();
        const { t } = this.props;
        return (
            <Container>
                {isL2() && <L2SignInHello switchUser={this.switchUser} />}
                {!this.isAuthenticated() && isParallel() ? (
                    <ParallelSignInHello switchUser={this.switchUser} />
                ) : (
                    <DemographicContainer>
                        {isCompetition() && (
                            // <DropdownButton
                            //     content={schools
                            //         .sort((a, b) =>
                            //             a.name.localeCompare(b.name, 'is-IS')
                            //         )
                            //         .map((school: School) => school.name)}
                            //     label={'Skóli'}
                            //     onSelect={this.onSchoolSelect}
                            //     selected={
                            //         school ? (school.name ? school.name : '') : ''
                            //     }
                            // />
                            <DropdownButton
                                content={institutions
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name, 'is-IS')
                                    )
                                    .map(
                                        (element: Institution) => element.name
                                    )}
                                label={'Skóli'}
                                onSelect={this.onInstitutionSelect}
                                selected={
                                    institution
                                        ? institution.name
                                            ? institution.name
                                            : ''
                                        : ''
                                }
                            />
                        )}
                        {isCompetition() && (
                            <CompetitionText>
                                {competitionText}
                                {/* <Link href="/skra" passHref>
                                <StyledLink>hér</StyledLink>
                            </Link> */}
                            </CompetitionText>
                        )}
                        <DropdownButton
                            content={ages.map((age: Demographic) => age.name)}
                            label={t('age')}
                            onSelect={this.onAgeSelect}
                            selected={selectedAge}
                        />
                        <ConsentAndSwitchUserContainer
                            active={hasConsent}
                            isCompetition={isCompetition()}
                            tabIndex={hasConsent ? 0 : -1}
                        >
                            <ConsentMessage>
                                {t('consent-confirmed')}
                            </ConsentMessage>
                            <SwitchUser onClick={this.switchUser}>
                                {t('switch-user')}
                            </SwitchUser>
                        </ConsentAndSwitchUserContainer>
                        <ShowMoreContainer
                            active={showConsentForm && !hasConsent}
                        >
                            <ConsentForm
                                onConsent={this.onConsent}
                                visible={showConsentForm}
                            />
                        </ShowMoreContainer>
                        <DropdownButton
                            content={genders.map((gender: Demographic) =>
                                t(gender.name)
                            )}
                            label={t('gender')}
                            onSelect={this.onGenderSelect}
                            selected={gender ? t(gender.name) : ''}
                        />
                        <DropdownButton
                            content={nativeLanguages.map(
                                (language: Demographic) => t(language.name)
                            )}
                            label={t('native-tongue')}
                            onSelect={this.onNativeLanguageSelect}
                            selected={
                                t(nativeLanguage?.name) ||
                                t('languages.islenska')
                            }
                        />
                        <DropdownButton
                            content={icelandicProficiencies.map(
                                (icelandicProficiency: Demographic) =>
                                    t(icelandicProficiency.name)
                            )}
                            label={t('icelandic-proficiency')}
                            onSelect={this.onIcelandicProficiencySelect}
                            selected={
                                t(icelandicProficiency?.name) ||
                                t('icelandic-proficiencies.other')
                            }
                        />
                        <Information title={t('why-this-matters')}>
                            <p>{t('why-this-matters-text')}</p>
                        </Information>
                        <AgreeContainer>
                            <Checkbox
                                checked={agreed}
                                onChange={this.handleAgree}
                            />
                            <span>
                                <Trans i18nKey="accept-terms-conditions" t={t}>
                                    Ég staðfesti að hafa kynnt mér{' '}
                                    <StyledLink href="/skilmalar">
                                        skilmála
                                    </StyledLink>{' '}
                                    og{' '}
                                    <StyledLink href="/personuverndaryfirlysing">
                                        persónuverndaryfirlýsingu
                                    </StyledLink>{' '}
                                    verkefnisins.
                                </Trans>
                            </span>
                        </AgreeContainer>
                        <SubmitButton
                            onClick={this.onSubmit}
                            disabled={
                                !formIsFilled ||
                                (showConsentForm && !hasConsent)
                            }
                        >
                            {t('common:continue')}
                        </SubmitButton>

                        {isCaptini() && (
                            <CaptiniSignInHello switchUser={this.switchUser} />
                        )}
                    </DemographicContainer>
                )}
            </Container>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation(['demographics', 'common'])(DemographicForm));
