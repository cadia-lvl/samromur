import * as React from 'react';
import styled from 'styled-components';

import FacebookIcon from '../../ui/icons/facebook';
import TwitterIcon from '../../ui/icons/twitter';

const Social = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 1fr 1fr;
`;

const SocialMessage = styled.div``;

const Links = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;

    & > * {
        margin-right: 1rem;
    }
`;

const IconLink = styled.a`
    cursor: pointer;
`;

interface Props {}

export const SocialLinks: React.FunctionComponent<Props> = (props) => {
    const shareUrl = 'https://samromur.is';
    const shareText = `Ljáðu íslenskri tungu rödd þína, gefðu raddsýni á ${shareUrl}}`;

    return (
        <Social>
            <SocialMessage>Viltu hvetja aðra til þátttöku?</SocialMessage>
            <Links>
                <IconLink
                    href={
                        'https://www.facebook.com/sharer/sharer.php?u=' +
                        encodeURIComponent(shareUrl)
                    }
                >
                    <FacebookIcon
                        height={30}
                        width={30}
                        fill={'white'}
                        hoverFill={'blue'}
                    />
                </IconLink>
                <IconLink
                    href={
                        'https://twitter.com/intent/tweet?text=' +
                        encodeURIComponent(shareText)
                    }
                >
                    <TwitterIcon
                        height={30}
                        width={30}
                        fill={'white'}
                        hoverFill={'blue'}
                    />
                </IconLink>
            </Links>
        </Social>
    );
};

export default SocialLinks;
