import * as React from 'react';
import { useSelector } from 'react-redux';
import RootState from '../../store/root-state';
import Link from 'next/link';
import styled from 'styled-components';
import { StyledLink } from '../ui/links';
import {isCompetition} from "../../utilities/competition-helper";

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
                    Þú getur fylgst með framvindu þinni með því að búa til aðgang.
                    <br></br>
                    <Link href={'/innskraning'} passHref>
                        <StyledLink>
                            Smelltu hér til að skrá þig inn eða búa til aðgang.
                        </StyledLink>
                    </Link>
                </HelloContainer>
            )}
        </L2Container>
    );
};