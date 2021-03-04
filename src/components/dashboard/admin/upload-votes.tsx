import { verify } from 'jsonwebtoken';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { SentenceBatch } from '../../../types/sentences';
import FileBrowser from '../../admin/sentences/file-browser';
import * as adminApi from '../../../services/admin-api';
import { VoteBatchFile } from '../../../types/votes';

const UploadVotesContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;

    & > * {
        margin-bottom: 1rem;
    }
`;

const BrowseBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const Status = styled.div`
    display: flex;
    align-items: center;

    & span {
        font-weight: 600;
        margin: 0 0.3rem;
    }
`;

const Button = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.colors.blue};
    color: white;
    cursor: pointer;
    font-weight: 600;

    :active {
        transform: translateY(2px);
    }
`;

const Message = styled.div`
    font-size: 1.3rem;
`;

const InformationText = styled.div`
    font-size: 1rem;
`;

export const UploadVotes: React.FunctionComponent = () => {
    const [voteBatch, setVoteBatch] = useState<VoteBatchFile | undefined>(
        undefined
    );
    const onChange = (batch: SentenceBatch): void => {
        const voteBatchFile: VoteBatchFile = batch.file;
        setVoteBatch(voteBatchFile);
    };

    const submit = () => {
        if (verifyBatch() && voteBatch) {
            adminApi.addVotesBatch(voteBatch);
        }
        console.log(voteBatch?.text);
    };

    const verifyBatch = (): boolean => {
        //TODO: add nice verification logic that the file is in the right format
        return true;
    };

    return (
        <UploadVotesContainer>
            <BrowseBar>
                <Status>
                    {voteBatch && (
                        <React.Fragment>
                            File has size <span>{voteBatch.size}</span> with{' '}
                            <span>{voteBatch.text.split('\n').length - 1}</span>{' '}
                            votes{' '}
                        </React.Fragment>
                    )}
                </Status>
                <FileBrowser onFileChange={onChange}>
                    <Button>Velja skrár</Button>
                </FileBrowser>
            </BrowseBar>
            <Message>
                {!voteBatch ? (
                    <InformationText>
                        Upload votes in a comma separated text file with clipid,
                        vote.
                    </InformationText>
                ) : (
                    <Button onClick={submit}>Senda in</Button>
                )}
            </Message>
        </UploadVotesContainer>
    );
};
