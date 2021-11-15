import * as React from 'react';
import Layout from '../components/layout/layout';
import SignUpForm from '../components/signup/sign-up-form';
import styled from 'styled-components';
import * as colors from '../components/competition/ui/colors';
import { ReddumTitle } from '../components/competition/ui/reddum-title';
import { isCompetitionOver } from '../utilities/competition-helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { pages } from '../constants/paths';

const SignUpFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    /* margin-top: 5rem; */
    padding: 1rem;
`;

const ExtraMargin = styled.div`
    margin-top: 5rem;
`;

const SignUp: React.FunctionComponent = () => {
    const router = useRouter();

    useEffect(() => {
        if (isCompetitionOver()) {
            router.replace(pages.scoreboard);
        }
    }, [isCompetitionOver()]);

    return (
        <Layout white={true}>
            <SignUpFormContainer>
                <ExtraMargin>
                    <ReddumTitle />
                </ExtraMargin>
                {!isCompetitionOver() && <SignUpForm />}
            </SignUpFormContainer>
        </Layout>
    );
};

export default SignUp;
