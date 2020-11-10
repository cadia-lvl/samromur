import * as React from 'react';
import styled from 'styled-components';
import SentenceBatches from '../../components/admin/sentences/sentence-batches';
import AddSentences from '../../components/admin/sentences/add-sentences';
import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { Subject } from 'rxjs';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { RootState } from 'typesafe-actions';
import { fetchAllSentencesInfo } from '../../store/admin/actions';
import rootEpic from '../../store/root-epic';
import services from '../../services';

import makeSSRDispatch from '../../utilities/ssr-request';

import { FloatingContainer } from '../../components/ui/containers';

import Layout from '../../components/layout/layout';

import { SentenceGroupInfo } from '../../types/sentences';

const SentencesPageContainer = styled.div`
    height: 100%;
    width: 100%;
    max-width: 64rem;
    margin: 0.5rem auto;
    padding: 0.5rem;
`;

const SentencesPageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(15rem, auto));
    grid-template-rows: repeat(auto-fill, min-content);
    gap: 1rem;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
        grid-template-rows: 100%; //repeat(2, min-content);
        gap: 1rem;
    }
`;

const dispatchProps = {
    fetchAllSentencesInfo: fetchAllSentencesInfo.request,
};

interface State {
    showAddSentences: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class SentencesPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showAddSentences: false,
        };
    }

    static async getInitialProps(ctx: NextPageContext) {
        makeSSRDispatch(ctx, fetchAllSentencesInfo.request);

        return {
            namespacesRequired: ['common'],
        };
    }

    openContribute = () => {
        this.setState({ showAddSentences: true });
    };

    closeContribute = () => {
        this.setState({
            showAddSentences: false,
        });
    };

    render() {
        const { sentences } = this.props;

        return (
            <Layout>
                <SentencesPageContainer title={'Setningar'}>
                    <SentencesPageGrid>
                        <AddSentences onClose={this.closeContribute} />
                        <SentenceBatches batches={sentences} />
                        {/* <SentenceBatchDetails /> */}
                    </SentencesPageGrid>
                </SentencesPageContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    sentences: state.admin.sentences,
});

export default connect(mapStateToProps, dispatchProps)(SentencesPage);
