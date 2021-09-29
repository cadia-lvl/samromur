import * as React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/layout';
import ForgotPassword from '../components/login/forgot-password';
import ResetPassword from '../components/login/reset-password';
import { useRouter } from 'next/router';

const ForgotPasswordPageContainer = styled.div`
    width: 100%;
    margin: 1rem auto;
    padding: 0.5rem;
`;

const Title = styled.h3`
    margin-bottom: 2rem;
`;

const ForgotPasswordPage = () => {
    const router = useRouter();
    const token = router.query.token as string;
    const email = router.query.email as string;

    return (
        <Layout>
            <ForgotPasswordPageContainer>
                {!token ? (
                    <ForgotPassword />
                ) : (
                    <ResetPassword token={token} email={email} />
                )}
            </ForgotPasswordPageContainer>
        </Layout>
    );
};

export default ForgotPasswordPage;
