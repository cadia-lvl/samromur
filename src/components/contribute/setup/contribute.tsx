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
import { WithTranslation, withTranslation } from '../../../server/i18n';
import { isCompetition } from '../../../utilities/competition-helper';
import { ASSOCIATION_OF_THE_DYSLEXIC } from '../../../constants/competition';

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

const redirectKidsToHerma = true;

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
    labels?: string[];
    sentencesSource?: string;
    demo?: boolean;
}

type Props = ReturnType<typeof mapStateToProps> &
    ContributeProps &
    typeof dispatchProps &
    WithTranslation &
    WithRouterProps;

interface State {
    batchClips?: WheelClip[];
    contributeType?: ContributeType;
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
            demographic: false,
            tips: false,
            clipsToRepeat: this.props.clipsToRepeat,
        };
    }

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
        const { contributeType, demographic, selectedBatch } = this.state;
        const {
            contribute: { goal },
            labels,
            t,
        } = this.props;
        if (!contributeType) {
            return t('common:take-part');
        } else {
            if (
                contributeType == ContributeType.SPEAK ||
                contributeType == ContributeType.REPEAT
            ) {
                if (!demographic && goal) {
                    return t('your-voice');
                }
                return goal
                    ? t('tips')
                    : contributeType == ContributeType.SPEAK
                    ? t('package-select.speak.how-much')
                    : t('package-select.repeat.how-much');
            } else {
                return goal
                    ? t('tips-listen')
                    : labels && labels.length > 0 && !selectedBatch
                    ? t('select-verification-package')
                    : t('package-select.listen.how-much');
            }
        }
    };

    onDemographicsSubmit = async (
        age: Demographic,
        nativeLanguage: Demographic,
        institution?: string
    ) => {
        const {
            user: {
                client: { id },
            },
            demo,
        } = this.props;
        const ageGroup = getAgeGroup(age.id, nativeLanguage.id);

        // Re-direct kids to herma during competition
        // Re-direct association of the dyslexic to herma
        // TODO: decide if this should be always until herma collection goals are met.
        if (redirectKidsToHerma && !demo) {
            if (
                ageGroup == AgeGroups.CHILDREN ||
                (ageGroup == AgeGroups.TEENAGERS &&
                    nativeLanguage.id == 'islenska') ||
                institution == ASSOCIATION_OF_THE_DYSLEXIC
            ) {
                const clips = await contributeApi.fetchClipsToRepeat({
                    count: 20,
                    clientId: id,
                });
                this.setState({ contributeType: ContributeType.REPEAT });
                this.setState({ clipsToRepeat: clips });
                this.setState({ demographic: true });

                return;
            }
        }

        const { groupedSentences } = this.props;
        const sentences = groupedSentences
            ? groupedSentences[ageGroup]
            : undefined;

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
        const {
            contribute: { goal, gaming },
            setGaming,
        } = this.props;
        if (goal && !gaming) {
            setGaming(true);
        }
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
            selectedBatch,
            batchClips,
            sentences,
            clipsToRepeat: repeatedClips,
        } = this.state;

        const {
            clips,
            contribute: { expanded, gaming, goal },
            user: { client },
            labels,
            sentencesSource,
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
                    ) : labels && labels.length > 0 && !selectedBatch ? (
                        <BatchSelect
                            labels={labels}
                            setLabel={this.onSelectBatch}
                        />
                    ) : !goal ? (
                        <PackageSelect
                            contributeType={contributeType}
                            setGoal={this.setGoal}
                        />
                    ) : (contributeType === ContributeType.SPEAK ||
                          contributeType === ContributeType.REPEAT) &&
                      !demographic ? (
                        <DemographicForm onSubmit={this.onDemographicsSubmit} />
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
                            sentencesSource={sentencesSource}
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

export default connect(
    mapStateToProps,
    dispatchProps
)(withRouter(withTranslation(['contribute', 'common'])(Contribute)));
