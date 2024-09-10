import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';
import { isCompetition } from '../../utilities/competition-helper';
import { useTranslation } from 'react-i18next';

const L2Container = styled.div`
    padding-bottom: 2rem;
    display: block;
`;

const HelloContainer = styled.div`
    border: none;
`;

interface Props {
    switchUser: () => void;
}

export const L2SignInHello: React.FC<Props> = (props) => {
    const { t } = useTranslation('l2');

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
        <L2Container>
            {!isAuthenticated && (
                <HelloContainer>
                    Þessi söfnun hefur sem markmið að auka fjölbreytni í
                    íslenskum máltæknigögnum. Máltækni hefur náð langt á
                    undanförnum árum en mörg talgreiningarkerfi eiga enn erfitt
                    með að skilja íslensku innflytjenda. Við hvetjum alla sem
                    eiga íslensku sem annað tungumál að taka þátt, jafnt
                    byrjendum sem þeim sem tala reiprennandi íslensku. Þetta
                    safn ætti að ná yfir alls kyns íslensku.
                    <br></br>
                    <br></br>
                    {t('sign-in-hello')}
                    <br></br>
                    <Link href={'/innskraning'} passHref>
                        <StyledLink>{t('sign-in-hello-link')}</StyledLink>
                    </Link>
                </HelloContainer>
            )}
        </L2Container>
    );
};
