import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FooterTitle from './title';
import FooterLinks from './links';
import SocialLinks from './social';
import SubscribeEmailForm from './subscribe';

const FooterContainer = styled.footer`
    /* position: inherit; */
    /* bottom: 0; */
    /* left: -5%; */
    display: flex;
    align-items: center;
    z-index: -1;
    /* width: 110%;
    min-height: 25%; */
    width: 100vw;
    min-height: ${({ theme }) => theme.layout.footerHeight};
    //max-height: 100%;
    /* background: url(/images/Skraut_1.png); */
    background: url(/images/Skraut_1.png);
    /* background-color: red; */
    /* background-size: cover; */
    /* background-repeat: no-repeat; */

    background-position-y: top;
    background-position-x: center;
    ${({ theme }) => theme.media.small} {
        /* background-position: bottom; */
        background-size: 100%;
        background-repeat: no-repeat;
        position: relative;
    }
    /* background-position: top; */
    color: ${({ theme }) => theme.colors.offWhite};
`;

const FooterGrid = styled.div`
    margin: 0 auto;
    /* background-color: black; */
    width: ${({ theme }) => theme.layout.footerWidth};
    display: flex;
    /* grid-template-columns: 1fr 1fr;
    grid-template-rows: 100%; */
    justify-content: flex-end;
    gap: 1.5rem;
    padding: 1rem;
    max-height: 100%;
    /* ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
        grid-template-rows: auto;
        & > * {
            width: 100%;
            max-width: ${({ theme }) => theme.layout.footerWidthSmall};
        }
    } */
`;

interface Props {}

export const Footer: FunctionComponent<Props> = (props) => {
    // const router = useRouter();
    // const { pathname } = router;
    return (
        <FooterContainer>
            {/* <FooterGrid> */}
            {/* <FooterTitle /> */}
            {/* <FooterLinks /> */}
            {/* <SocialLinks />
                <SubscribeEmailForm /> */}
            {/* </FooterGrid> */}
        </FooterContainer>
    );
};

export default Footer;
