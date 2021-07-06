import * as React from 'react';
import { connect } from 'react-redux';
import { NextPageContext } from 'next';
import { RootState } from 'typesafe-actions';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import styled from 'styled-components';

import {
    resetContribute,
    setGoal,
    setGaming,
} from '../store/contribute/actions';
import Contribute from '../components/contribute/setup/contribute';

/* 
import { Goal } from '../types/contribute';
import Layout from '../components/layout/layout';
import TypeSelect from '../components/contribute/setup/type-select';

const ContributeContainer = styled.div`
    position: absolute;
    top: ${({ theme }) => theme.layout.hudHeight};
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    align-items: center;
    width: 100%;
    max-width: ${({ theme }) => theme.layout.gameWidth};
    padding: 1rem;
`;

const Instruction = styled.h2`
    margin-bottom: 2rem;
`;

const FakeDiv = styled.div``; */

const dispatchProps = {
    setGoal,
    setGaming,
};

interface ContributePageProps {}

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    ContributePageProps &
    WithRouterProps;

interface State {}

class ContributePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    static getInitialProps = async ({
        store,
        isServer,
        query,
    }: NextPageContext) => {
        store.dispatch(resetContribute());
        store.dispatch(setGaming(false));
        return {
            namespacesRequired: ['common'],
        };
    };

    selectType = (contributeType: string) => {
        const { router } = this.props;
        router.push(`/${contributeType}`);
    };

    render() {
        return <Contribute />;
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    user: state.user,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(withRouter(ContributePage));
