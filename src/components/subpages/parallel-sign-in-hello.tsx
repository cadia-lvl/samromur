import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';
import { useTranslation } from 'react-i18next';

const ParallelContainer = styled.div`
    padding-bottom: 2rem;
    display: block;
`;

const SignInContainer = styled.div`
    border: none;
`;

interface Props {
    switchUser: () => void;
}

export const ParallelSignInHello: React.FC<Props> = (props) => {
    const { t } = useTranslation('parallel');
    const {
        client: { isAuthenticated, username },
    } = useSelector((state: RootState) => state.user);

    // State to handle dynamic rendering
    const [clientRendered, setClientRendered] = React.useState(false);

    React.useEffect(() => {
        // Set client-rendered state after component mounts
        setClientRendered(true);
    }, []);

    if (!clientRendered) {
        return null;
    }

    return (
        <ParallelContainer>
            <SignInContainer>
                {t('parallel-explanation-long')}
                <br></br>
                <br></br>
                {t('to-take-part')}
                <br></br>
                <ol>
                    <li>
                        <Link href={'/innskraning'} passHref>
                            <StyledLink>{t('sign-in-hello-link')}</StyledLink>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={'https://forms.gle/bwHyc332vbmJa1VT7'}
                            passHref
                        >
                            <StyledLink>{t('google-form-link')}</StyledLink>
                        </Link>
                    </li>
                </ol>
            </SignInContainer>
        </ParallelContainer>
    );
};
