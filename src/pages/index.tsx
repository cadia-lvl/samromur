import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import {
    fetchTotalClips,
    fetchTotalClipsTimeline,
    fetchTotalClipsClients,
} from '../store/stats/actions';
import makeSSRDispatch from '../utilities/ssr-request';
import { pages } from '../constants/paths';

// Components
import Layout from '../components/layout/layout';
import TotalChart from '../components/charts/total-chart';
import FrontPageStats from '../components/charts/frontpage-stats';
import MicIcon from '../components/ui/icons/mic';
import {
    isCompetition,
    isCompetitionOver,
} from '../utilities/competition-helper';
import { ReddumMalinuWhite } from '../components/ui/logos/reddum-malinu';
import { theme } from '../styles/global';
import Link from 'next/link';

const FrontPageContainer = styled.div`
    /*     background: url(/images/wave-footer.png) repeat-x bottom;*/
    background: url(/images/wave-footer@3x.png) no-repeat bottom;
    background-size: 100% auto;
    background-color: ${({ theme }) => theme.colors.white};
    display: flex;
    flex-direction: column;
    & > * {
        margin-bottom: 1rem;
    }
`;

const FrontPageContent = styled.div`
    width: ${({ theme }) => theme.layout.desktopWidth};
    max-width: 100%;
    margin: 0 auto;
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > * {
        margin-bottom: 1rem;
    }
`;

const BottomContent = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    & > * {
        margin-right: 1rem;
    }
    padding: 1.5rem;
    align-items: center;
    margin-bottom: 2rem;
`;

const MiddleContent = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    align-items: center;
`;

const RobotMessage = styled.div`
    font-size: 1.5rem;
`;

const HeroChart = styled.div`
    margin: 0 auto;
    width: 100%;
    max-width: 50rem;
    height: 25rem;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.08);
`;

const ChartContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 2rem;
`;

const ChartLegend = styled.div`
    padding: 1.5rem;
    padding-bottom: 0rem;
    display: flex;
    flex-direction: column;
`;

const ChartTitle = styled.span`
    font-size: 1rem;
    color: grey;
    font-weight: 500;
`;

const ChartSubTitle = styled.span`
    font-size: 0.9rem;
`;

const CallToAction = styled.div`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & > * {
        margin-bottom: 0.5rem;
    }
`;

const RobotAndTitle = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
    width: 50rem;
    max-width: 100%;
`;

const MarsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Mars = styled.div`
    content: url(/images/mars.svg);
    display: block;
    width: 8rem;
    ${({ theme }) => theme.media.small} {
        width: 8.5rem;
    }
`;

const TitleContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > * {
        margin-bottom: 1rem;
    }
`;

const CTATitle = styled.h3`
    margin: 1rem 0;
    text-align: center;
`;

interface ButtonProps {
    color: string;
}

const CTAButton = styled.button<ButtonProps>`
    flex: 1;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    padding: 0.5rem;
    background-color: ${({ color, theme }) => theme.colors[color]};
    color: white;
    cursor: pointer;
    width: 99%;
    max-width: 30rem;
    border: 1px solid white;

    transition: color, background-color 0.15s ease-in-out;

    & :active {
        transform: translateY(2px);
    }

    & :hover {
        background-color: white;
        color: ${({ color, theme }) => theme.colors[color]};
        border: 1px solid ${({ color, theme }) => theme.colors[color]};
    }
`;

const ChartsContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 100%; //1fr 1fr;
    gap: 1rem;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
    }
`;

const MicButton = styled.div`
    position: relative;
    width: 5rem;
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 50%;

    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.18);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.18);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.18);

    cursor: pointer;
    & :active {
        transform: translateY(2px);
    }
`;

const LogoContainer = styled.div`
    max-width: 20rem;

    cursor: pointer;
    transition: transform 0.2s;

    & :hover {
        transform: scale(1.2);
    }
`;

const CTAStats = styled.div`
    margin: 1rem 0;
    width: 50rem;
    max-width: 100%;
    font-size: 1.3rem;
    text-align: center;
    display: flex;
    flex-direction: column;
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

const dispatchProps = {};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

class IndexPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static getInitialProps = async (ctx: NextPageContext) => {
        // If missing props fetch from db
        if (IndexPage.missingProps(ctx)) {
            // Total clips chart
            await makeSSRDispatch(ctx, fetchTotalClipsTimeline.request);

            // Clips count chart
            await makeSSRDispatch(ctx, fetchTotalClips.request);

            // Client count chart
            await makeSSRDispatch(ctx, fetchTotalClipsClients.request);
        }

        return {
            namespacesRequired: ['common'],
        };
    };

    static missingProps = (ctx: NextPageContext): boolean => {
        const { store } = ctx;
        const {
            stats: { totalClipsTimeline, totalClips, totalClipsClients },
        } = store.getState();

        // If any are missing, return false
        return (
            !store ||
            totalClipsTimeline?.length === 0 ||
            !totalClips ||
            !totalClipsClients
        );
    };

    render() {
        const { t, i18n } = this.props;
        // const introduction = this.props.t('introduction-markdown');
        const { router, stats } = this.props;
        return (
            <Layout>
                <FrontPageContainer>
                    <FrontPageContent>
                        <CallToAction>
                            {isCompetition() ? (
                                <CTATitle>
                                    Lestrarkeppni grunnskóla er í fullum gangi!
                                </CTATitle>
                            ) : (
                                !isCompetitionOver() && (
                                    <CTAStats>
                                        Þriðja Lestrarkeppni grunnskólanna hefst
                                        klukkan 15:00 í dag! <br />
                                        <Link href={'/grunnskolakeppni2022'}>
                                            <LinkText>
                                                Smelltu hérna til að lesa meira.
                                            </LinkText>
                                        </Link>
                                    </CTAStats>
                                )
                            )}
                            <RobotAndTitle>
                                <MarsContainer>
                                    <Mars />
                                </MarsContainer>
                                <TitleContainer>
                                    <CTATitle>
                                        {isCompetition() ? (
                                            <p>
                                                Smelltu á Taka þátt til hjálpa
                                                þínum skóla að sigra!
                                            </p>
                                        ) : (
                                            t('call-to-action')
                                        )}
                                    </CTATitle>
                                    <CTAButton
                                        onClick={() =>
                                            router.push(pages.contribute)
                                        }
                                        color={'validGreen'}
                                    >
                                        {t('common:take-part')}
                                    </CTAButton>
                                </TitleContainer>
                            </RobotAndTitle>
                            <FrontPageStats
                                clients={stats.totalClipsClients}
                                clips={stats.totalClips}
                            />
                        </CallToAction>

                        {/*                         <MiddleContent>
                            
                            <CTAButton onClick={() => router.push(pages.about)} color={'blue'}>Lesa meira um verkefnið</CTAButton>

                        </MiddleContent> */}

                        <ChartsContainer>
                            <HeroChart>
                                <ChartLegend>
                                    <ChartTitle>{t('chart-title')}</ChartTitle>
                                    {/* <ChartSubTitle>síðastliðinn mánuð</ChartSubTitle> */}
                                </ChartLegend>
                                <ChartContainer>
                                    <TotalChart />
                                </ChartContainer>
                            </HeroChart>
                        </ChartsContainer>
                        <BottomContent>
                            {/*    <RobotMessage>Viltu gefa raddsýni?</RobotMessage>
                        <MicButton onClick={() => router.push(pages.speak)} >
                            <MicIcon fill={'green'} height={35} width={35} />
                        </MicButton> */}
                        </BottomContent>
                    </FrontPageContent>
                </FrontPageContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    stats: state.stats,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation(['home', 'common'])(withRouter(IndexPage)));
