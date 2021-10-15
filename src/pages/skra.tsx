import * as React from 'react';
import Layout from '../components/layout/layout';
import SignUpForm from '../components/signup/sign-up-form';
import styled from 'styled-components';

const SignUpFormContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const SignUp: React.FunctionComponent = () => {
    return (
        <Layout>
            <SignUpFormContainer>
                <SignUpForm />
            </SignUpFormContainer>
        </Layout>
    );
};

export default SignUp;
