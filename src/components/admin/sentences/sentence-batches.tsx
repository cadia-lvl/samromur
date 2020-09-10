import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import styled from 'styled-components';

import { FloatingContainer } from '../../ui/containers';
import { Button } from '../../ui/buttons';
import { SentenceGroupInfo } from '../../../types/sentences';
import Grid from '../../ui/grid/grid';
import AddSentences from './add-sentences';

const SentenceBatchesContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const SentencesGrid = styled(Grid)`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(auto-fill, 2rem);
    grid-auto-rows: 2rem;
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

interface Props {
    batches: Array<SentenceGroupInfo>;
}

interface State {

}

class SentenceBatches extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    onValidate = () => {

    }

    render() {


        return (
            <SentenceBatchesContainer>
                <h4>Setningapakkar</h4>
                <SentencesGrid
                    wrapGridArguments={{ easing: 'backOut', stagger: 10, duration: 400 }}
                >
                    {
                        !!this.props.batches && this.props.batches.map((batch: SentenceGroupInfo, index: number) => {
                            return <span key={index}>{batch.batch}: {batch.count}</span>
                        })
                    }
                </SentencesGrid>
            </SentenceBatchesContainer >
        );
    }
}

export default SentenceBatches;