import { NextPageContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { withTranslation, WithTranslation } from '../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";

import { fetchTotalClips, fetchTotalClipsTimeline, fetchTotalClipsClients } from '../store/stats/actions';
import makeSSRDispatch from '../utilities/ssr-request';
import { pages } from '../constants/paths';

// Components
import Layout from '../components/layout/layout';
import TotalChart from '../components/charts/total-chart';
import ArrowRightIcon from '../components/ui/icons/arrow-right';
import MicIcon from '../components/ui/icons/mic';

const FrontPageContainer = styled.div`
    background: url(/images/light-waves.svg) repeat-x bottom;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    gap: 1rem;
`;

const BottomContent = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
    align-items: center;
    margin-bottom: 2rem;
`;

const RobotMessage = styled.div`
    width: 100%;
    max-width: 20rem;
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
    box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
    -moz-box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
    -webkit-box-shadow: 0 0 3px 2px rgba(0,0,0,.08);
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
    font-size: 1.5rem;
    font-weight: 600;
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
    gap: 1rem;
`;

const RobotAndTitle = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
    width: 50rem;
    max-width: 100%;

    ${({ theme }) => theme.media.small} {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
`;

const MarsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Mars = styled.div`
    content: url(/images/mars.svg);
    display: block;
    width: 12rem;
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
    ${({ theme }) => theme.media.small} {
        margin-bottom: 3rem;
    }
`;

const ReadMore = styled.div`
    position: absolute;
    bottom: -2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    & :active {
        transform: translateY(2px);
    }
`;

const CTATitle = styled.h3`
    text-align: center;
`;

interface ButtonProps {
    color: string;
}

const CTAButton = styled.div<ButtonProps>`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    padding: 0.5rem;
    background-color: ${({ color, theme }) => theme.colors[color]};
    color: white;
    cursor: pointer;
    width: 100%;
    max-width: 30rem;
    & :active {
        transform: translateY(2px);
    }
`;

const CTAStats = styled.div`
    margin: 1rem 0;
    width: 40rem;
    max-width: 100%;
    font-size: 1.3rem;
    text-align: center;
    
    & span {
        font-size: 1.5rem;
        font-weight: 600;
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
    
    box-shadow: 0 0 3px 1px rgba(0,0,0,.18);
    -moz-box-shadow: 0 0 3px 1px rgba(0,0,0,.18);
    -webkit-box-shadow: 0 0 3px 1px rgba(0,0,0,.18);

    cursor: pointer;
    & :active {
        transform: translateY(2px);
    }
`;
const dispatchProps = {

}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & WithTranslation & WithRouterProps;

class IndexPage extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    static getInitialProps = async (ctx: NextPageContext) => {

        // Total clips chart
        await makeSSRDispatch(ctx, fetchTotalClipsTimeline.request);

        // Clips count chart
        await makeSSRDispatch(ctx, fetchTotalClips.request);

        // Client count chart
        await makeSSRDispatch(ctx, fetchTotalClipsClients.request);

        return ({
            namespacesRequired: ['common'],
        });
    }

    render() {
        const introduction = this.props.t('introduction-markdown');
        const { router, stats } = this.props;
        return (
            <Layout>
                <FrontPageContainer>
                    <FrontPageContent>
                        <CallToAction>
                            <RobotAndTitle>
                                <MarsContainer>
                                    <Mars />
                                </MarsContainer>
                                <TitleContainer>
                                    <CTATitle>Saman ætlum við að búa til stærsta íslenska raddgagnasafnið</CTATitle>
                                    <ReadMore onClick={() => router.push(pages.about)} ><span>Lesa meira um Samróm</span><ArrowRightIcon fill={'gray'} height={12} width={12} /></ReadMore>
                                </TitleContainer>
                            </RobotAndTitle>
                            <CTAButton onClick={() => router.push(pages.contribute)} color={'blue'}>Taka þátt</CTAButton>
                            <CTAStats>
                                Hingað til hafa <span>{stats.totalClipsClients.toLocaleString('is').replace(',', '.')}</span> þátttakendur lesið inn <span>{stats.totalClips.toLocaleString('is').replace(',', '.')}</span> setningar
                            </CTAStats>
                        </CallToAction>
                        <ChartsContainer>
                            <HeroChart>
                                <ChartLegend>
                                    <ChartTitle>Innlesnar setningar</ChartTitle>
                                    <ChartSubTitle>síðastliðinn mánuð</ChartSubTitle>
                                </ChartLegend>
                                <ChartContainer>
                                    <TotalChart />
                                </ChartContainer>
                            </HeroChart>
                        </ChartsContainer>
                    </FrontPageContent>
                    <BottomContent>
                        <RobotMessage>Ertu tilbúin(n) að gefa raddsýni?</RobotMessage>
                        <MicButton onClick={() => router.push(pages.speak)} >
                            <MicIcon fill={'blue'} height={35} width={35} />
                        </MicButton>
                    </BottomContent>
                </FrontPageContainer>
            </Layout >
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    stats: state.stats,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withTranslation('common')(withRouter(IndexPage)));