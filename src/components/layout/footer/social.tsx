import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { IconButton } from '../../ui/buttons';

const Social = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 1fr 1fr;

`

const SocialMessage = styled.div`

`;

const Links = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;

    & > * {
        margin-right: 1rem;
    }
`

interface Props {

}

export const SocialLinks: React.FunctionComponent<Props> = (props) => {
    return (
        <Social>
            <SocialMessage>Viltu hvetja aðra til þátttöku?</SocialMessage>
            <Links>
                <IconButton icon={{ height: 30, width: 30, fill: "white", hoverFill: "blue" }} onClickHandler={() => { }} type='facebook' />
                <IconButton icon={{ height: 30, width: 30, fill: "white", hoverFill: "blue" }} onClickHandler={() => { }} type='twitter' />
            </Links>
        </Social>
    )
}

export default SocialLinks;