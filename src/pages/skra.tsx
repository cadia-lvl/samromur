import * as React from 'react';
import Layout from '../components/layout/layout';
import SignUpForm from '../components/competition/sign-up-form';
import styled from 'styled-components';
import ReddumMalinuWhite from '../components/ui/logos/reddum-malinu';
import { getWheelColorString } from '../utilities/color-utility';
import { WheelColor } from '../types/contribute';
import { theme } from '../styles/global';
import { isCompetitionOver } from '../utilities/competition-helper';
// import { ReddumTitle } from '../components/competition/ui/reddum-title';

const SignUpFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    /* margin-top: 5rem; */
    padding: 1rem;
`;

const ExtraMargin = styled.div`
    max-width: 20rem;
    padding: 3rem;
`;

const CenterContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SignUp: React.FunctionComponent = () => {
    return (
        <Layout>
            {!isCompetitionOver() ? (
                <SignUpFormContainer>
                    <ExtraMargin>
                        <ReddumMalinuWhite fill={theme.colors.darkerBlue} />
                    </ExtraMargin>
                    <SignUpForm />
                </SignUpFormContainer>
            ) : (
                <CenterContainer>
                    Vinnustaðakeppninni Reddum málinu er nú lokið.
                </CenterContainer>
            )}
        </Layout>
    );
};

export default SignUp;
