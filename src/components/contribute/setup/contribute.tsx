import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

import {
    fetchSentences,
    FetchSamplesPayload,
} from '../../../services/contribute-api';
import { SimpleSentence, WheelSentence } from '../../../types/sentences';
import { ContributeType, Goal } from '../../../types/contribute';
import * as adminApi from '../../../services/admin-api';
import * as contributeApi from '../../../services/contribute-api';

import {
    resetContribute,
    setGaming,
    setGoal,
} from '../../../store/contribute/actions';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import Layout from '../../layout/layout';
import CarouselWheel from '../carousel/wheel';
import DemographicForm from './demographic-form';
import PackageSelect from './package-select';
import BatchSelect from './batch-select';
import { Clip, WheelClip } from '../../../types/samples';
import TypeSelect from './type-select';
import Tips from './tips/tips';

import {
    AgeGroups,
    getAgeGroup,
} from '../../../utilities/demographics-age-helper';
import { AllGroupsSentences } from '../../../pages/tala';
import { Demographic } from '../../../types/user';

interface ContributeContainerProps {
    expanded: boolean;
    gaming: boolean;
}

const ContributeContainer = styled.div<ContributeContainerProps>`
    display: grid;
    width: 100%;
    max-width: ${({ expanded, theme }) =>
        expanded ? '100vw' : theme.layout.gameWidth};
    transition: top 0.5s ${({ theme }) => theme.transitions.main},
        max-width 0.5s ${({ theme }) => theme.transitions.main};
    grid-template-columns: 1fr;
    grid-template-rows: ${({ gaming, theme }) =>
            !gaming && theme.layout.hudHeight} auto auto;
    justify-items: center;
    padding: ${({ gaming }) => (!gaming ? '1rem' : '0rem')};
`;

const Instruction = styled.h2`
    margin-bottom: 2rem;
`;

const dispatchProps = {
    resetContribute,
    setGaming,
    setGoal,
};

interface ContributeProps {
    clips?: WheelClip[];
    groupedSentences?: AllGroupsSentences;
    contributeType?: ContributeType;
    clipsToRepeat?: WheelClip[];
}

type Props = ReturnType<typeof mapStateToProps> &
    ContributeProps &
    typeof dispatchProps &
    WithRouterProps;

interface State {
    batchClips?: WheelClip[];
    contributeType?: ContributeType;
    labels: string[];
    demographic: boolean;
    tips: boolean;
    selectedBatch?: string;
    sentences?: WheelSentence[];
    clipsToRepeat?: WheelClip[];
}

class Contribute extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            contributeType: this.props.contributeType,
            labels: [],
            demographic: false,
            tips: false,
            clipsToRepeat: this.props.clipsToRepeat,
        };
    }

    componentDidMount = async () => {
        const {
            user: {
                client: { isSuperUser },
            },
        } = this.props;
        if (isSuperUser) {
            const labels = await adminApi.fetchVerificationBatches();
            this.setState({
                labels: labels.filter((label) => label !== null),
            });
        }
    };

    getBatchClips = async (selectedBatch: string) => {
        const {
            user: {
                client: { id },
            },
        } = this.props;
        const batchClips = await contributeApi.fetchClips({
            batch: selectedBatch as string,
            clientId: id,
            count: 20,
        });
        this.setState({ batchClips });
    };

    getInstruction = (): string => {
        const {
            contributeType,
            demographic,
            labels,
            selectedBatch,
        } = this.state;
        const {
            contribute: { goal },
        } = this.props;
        if (!contributeType) {
            return 'Taka þátt';
        } else {
            if (
                contributeType == ContributeType.SPEAK ||
                contributeType == ContributeType.REPEAT
            ) {
                if (!demographic && goal) {
                    return 'Þín rödd';
                }
                return goal ? 'Góð ráð' : 'Hvað viltu lesa mikið?';
            } else {
                return goal
                    ? 'Góð ráð við yfirferð'
                    : labels.length > 0 && !selectedBatch
                    ? 'Hvaða yfirferðarflokk viltu hlusta á?'
                    : 'Veldu pakka';
            }
        }
    };

    onDemographicsSubmit = async (
        age: Demographic,
        nativeLanguage: Demographic
    ) => {
        const { groupedSentences } = this.props;
        const ageGroup = getAgeGroup(age.id, nativeLanguage.id);
        const sentences = groupedSentences && groupedSentences[ageGroup];
        this.setState({ sentences });
        this.setState({ demographic: true });
    };

    setGoal = (goal: Goal) => {
        const { setGoal } = this.props;
        setGoal(goal);
    };

    selectType = (contributeType: string) => {
        const { router } = this.props;
        router.push(`/${contributeType}`);
    };

    skipTips = () => {
        this.props.setGaming(true);
    };

    onSelectBatch = (selectedBatch: string) => {
        this.setState({ selectedBatch });
        this.getBatchClips(selectedBatch);
    };

    render() {
        const {
            contributeType,
            demographic,
            tips,
            labels,
            selectedBatch,
            batchClips,
            sentences,
            clipsToRepeat: repeatedClips,
        } = this.state;

        const {
            clips,
            contribute: { expanded, gaming, goal },
            user: { client },
        } = this.props;

        return (
            <Layout game>
                <ContributeContainer gaming={gaming} expanded={expanded}>
                    <div />
                    {!gaming ? (
                        <Instruction>{this.getInstruction()}</Instruction>
                    ) : (
                        <div />
                    )}
                    {!contributeType ? (
                        <TypeSelect setType={this.selectType} />
                    ) : !goal ? (
                        <PackageSelect
                            contributeType={contributeType}
                            setGoal={this.setGoal}
                        />
                    ) : (contributeType === ContributeType.SPEAK ||
                          contributeType === ContributeType.REPEAT) &&
                      !demographic ? (
                        <DemographicForm onSubmit={this.onDemographicsSubmit} />
                    ) : labels.length > 0 &&
                      !selectedBatch &&
                      contributeType == ContributeType.LISTEN ? (
                        <BatchSelect
                            labels={labels}
                            setLabel={this.onSelectBatch}
                        />
                    ) : !gaming ? (
                        client.skipTips ? (
                            this.skipTips()
                        ) : (
                            <Tips
                                onSkip={this.skipTips}
                                contributeType={contributeType}
                            />
                        )
                    ) : (
                        <CarouselWheel
                            batch={selectedBatch}
                            clips={
                                batchClips
                                    ? batchClips
                                    : contributeType != ContributeType.REPEAT
                                    ? clips
                                    : undefined
                            }
                            sentences={sentences}
                            clipsToRepeat={repeatedClips}
                            contributeType={contributeType}
                            // Add a sentencesAndclips attribute here?
                        />
                    )}
                </ContributeContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(withRouter(Contribute));
