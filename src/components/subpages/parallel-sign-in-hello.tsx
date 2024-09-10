import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';

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
                Samhliða safn til framburðarannsókna er máltækniverkefni sem
                snýst um að safna hljóðupptökum frá fólki sem talar íslensku sem
                annað mál og einnig frá fólki sem hefur íslensku sem móðurmál.
                Þessar hljóðupptökur verða notaðar til að búa til gagnasafn
                fyrir rannsóknir og þróun á máltækniforritum. Þátttakendur lesa
                setningar undir Samhliða safn til framburðarannsókna á Samrómi
                og svara nokkrum spurningum um aldur, kyn og tungumálakunnáttu í
                GoogleForms-skjali.
                <br></br>
                Til að taka þátt:
                <br></br>
                <ol>
                    <li>
                        <Link href={'/innskraning'} passHref>
                            <StyledLink>
                                Smelltu hér til að skrá þig inn eða búa til
                                aðgang.
                            </StyledLink>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={'https://forms.gle/bwHyc332vbmJa1VT7'}
                            passHref
                        >
                            <StyledLink>
                                Smelltu hér til að fylla út GoogleForms-skjalið.
                            </StyledLink>
                        </Link>
                    </li>
                </ol>
            </SignInContainer>
        </ParallelContainer>
    );
};
