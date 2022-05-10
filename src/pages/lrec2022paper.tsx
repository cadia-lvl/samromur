import * as React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout/layout';

const PaperContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LinkText = styled.span`
    font-size: 2.5 rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkerBlue};
    cursor: pointer;

    :hover {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.blackOlive};
    }
`;

const PrivacyPolicy: React.FunctionComponent = () => {
    return (
        <Layout>
            <PaperContainer>
                <a download href="static\samromur.pdf">
                    <LinkText>
                        Click here to download the LREC 2022 paper
                    </LinkText>
                </a>
            </PaperContainer>
        </Layout>
    );
};

export default PrivacyPolicy;
