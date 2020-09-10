import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

import { confirmSentences } from '../../../store/admin/actions';
import { uploadSentences } from '../../../services/admin-api';
import { Button } from '../../ui/buttons';
import { SentenceBatch, SentenceBatchResponse } from '../../../types/sentences';
import { RootState } from 'typesafe-actions';
import TextInput from '../../ui/input/text';
import UploadIcon from '../../ui/icons/upload';
import FileBrowser from './file-browser';

const AddSentencesContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const Controls = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    & > button {
        margin-left: 1rem;
    }
`;

interface AddSentencesProps {
    batch?: SentenceBatch;
    onClose: () => void;
}

const dispatchProps = {
    confirmSentences: confirmSentences.request,
}

type Props = typeof dispatchProps & AddSentencesProps;

interface State {
    id: string;
    batch: SentenceBatch;
    name: string;
    count: number;
    valid: boolean;
}

const initialState = {
    id: '',
    batch: {
        name: '',
        file: {
            name: '',
            size: 0,
            text: '',
        }
    },
    count: 0,
    name: '',
    valid: false,
}

class AddSentences extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = initialState;
    }

    onNameChange = (name: string) => {
        this.setState({ name });
    }

    onFileChange = (batch: SentenceBatch) => {
        this.setState({ batch });
    }

    onValidate = async () => {
        const {
            batch,
            name
        } = this.state;

        const newBatch = {
            ...batch,
            name: name
        }
        uploadSentences(newBatch).then((result: SentenceBatchResponse) => {
            this.setState({
                id: result.id,
                count: result.count,
                valid: result.valid,
            });
        });
    }

    onSubmit = async () => {
        const { id } = this.state;
        const { confirmSentences, onClose } = this.props;
        await confirmSentences(id);
        onClose();
    }

    render() {
        const {
            id,
            count,
            batch,
            name,
            valid
        } = this.state;

        const { onClose } = this.props;

        return (
            <AddSentencesContainer>
                <h4>Bæta við</h4>
                <TextInput
                    onChange={this.onNameChange}
                    label='Nafn setningapakka'
                    placeholder='Nafn'
                    text={name}
                />
                <FileBrowser onFileChange={this.onFileChange}>
                    <UploadIcon small />
                    {
                        !!batch && !valid ? <span>{batch.file.name}</span> : <span>{count} setningar</span>
                    }
                </FileBrowser>
                <Controls>
                    <Button
                        medium
                        color={'green'}
                        disabled={(!name || !batch)}
                        onClick={valid ? this.onSubmit : this.onValidate}
                    >
                        {valid ? 'Senda inn' : 'Yfirfara'}
                    </Button>
                </Controls>
            </AddSentencesContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    sentences: state.admin.sentences,
});

export default connect(
    mapStateToProps,
    dispatchProps
)(AddSentences);