import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

import {
    fetchSentences,
    FetchSamplesPayload,
} from '../../../services/contribute-api';
import { SimpleSentence, WheelSentence } from '../../../types/sentences';
import { Goal } from '../../../types/contribute';

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
import { WheelClip } from '../../../types/samples';
import TypeSelect from './type-select';
import Tips from './tips/tips';

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
    sentences?: WheelSentence[];
}

type Props = ReturnType<typeof mapStateToProps> &
    ContributeProps &
    typeof dispatchProps &
    WithRouterProps;

interface State {
    contributeType?: string;
    demographic: boolean;
    tips: boolean;
}

class Contribute extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            contributeType: this.props.clips
                ? 'hlusta'
                : this.props.sentences && 'tala',
            demographic: false,
            tips: false,
        };
    }

    getInstruction = (): string => {
        const { contributeType, demographic } = this.state;
        const {
            contribute: { goal },
        } = this.props;
        if (!contributeType) {
            return 'Taka þátt';
        } else {
            if (contributeType == 'tala') {
                if (!demographic) {
                    return 'Þín rödd';
                }
                return goal ? 'Góð ráð' : 'Hvað viltu lesa mikið?';
            } else {
                return goal ? 'Góð ráð við yfirferð' : 'Hvað viltu hlusta mikið/ Hvað viltu taka stóran pakka?';
            }
        }
    };

    onDemographicsSubmit = () => {
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

    render() {
        const { contributeType, demographic, tips } = this.state;

        const {
            clips,
            contribute: { expanded, gaming, goal },
            sentences,
        } = this.props;

        return (
            <Layout game>
                <ContributeContainer gaming={gaming} expanded={expanded}>
                    <div />
                    {!gaming ? <Instruction>{this.getInstruction()}</Instruction> : <div />}
                    {
                        !contributeType
                            ?
                            <TypeSelect setType={this.selectType} />
                            : (
                                contributeType == 'tala' && !demographic
                                    ?
                                    <DemographicForm onSubmit={this.onDemographicsSubmit} />
                                    : !goal
                                        ?
                                        <PackageSelect
                                            contributeType={contributeType}
                                            setGoal={this.setGoal}
                                        />
                                        : !gaming
                                            ?
                                            <Tips onSkip={this.skipTips} contributeType={contributeType}/>
                                            :
                                            <CarouselWheel
                                                clips={clips}
                                                sentences={sentences}
                                            />
                            )
                    }
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
