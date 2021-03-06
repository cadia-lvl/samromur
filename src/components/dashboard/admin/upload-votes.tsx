import { verify } from 'jsonwebtoken';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { SentenceBatch } from '../../../types/sentences';
import FileBrowser from '../../admin/sentences/file-browser';
import * as adminApi from '../../../services/admin-api';
import { Vote, VoteBatchFile } from '../../../types/votes';
import { ClipVote } from '../../../types/samples';
import { array } from 'js-md5';
import ProgressBar from './progress-bar';

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

const PogressBarContainer = styled.div`
    margin: 1rem;
`;

export const UploadVotes: React.FunctionComponent = () => {
    const [voteBatch, setVoteBatch] = useState<VoteBatchFile | undefined>(
        undefined
    );
    const [progress, setProgress] = useState(0);

    const onChange = (batch: SentenceBatch): void => {
        const voteBatchFile: VoteBatchFile = batch.file;
        setVoteBatch(voteBatchFile);
    };

    const onSubmit = async () => {
        if (verifyBatch() && voteBatch) {
            startUploadProcess();

            //console.log('got result back frontend: ', result);
        }
    };

    const startUploadProcess = async () => {
        // Process file to managable object
        if (!voteBatch) {
            // TODO: do error handling here
            return;
        }
        const votes: Array<Array<Vote>> = convertFileToVotesArray(voteBatch);
        for (let i = 0; i < votes.length; i++) {
            const result = await adminApi.addVotesBatch(votes[i]);
            console.log(`index ${i + 1} and length ${votes.length}.`);
            console.log(`inserted ${result} votes.`);
            setProgress((i + 1) / votes.length);
        }
    };

    const convertFileToVotesArray = (
        voteBatch: VoteBatchFile
    ): Array<Array<Vote>> => {
        const votesArray: Array<string> = voteBatch.text.split('\n');
        const votes: Array<Vote> = votesArray.map((item) => {
            const clipVote =
                parseInt(item.split(',')[1]) == 1
                    ? ClipVote.VALID
                    : ClipVote.INVALID;
            const vote: Vote = {
                clipId: parseInt(item.split(',')[0]),
                vote: clipVote,
            };
            return vote;
        });

        // Create chunks
        const chunkSize = 1000;
        const voteChunks: Array<Array<Vote>> = [];
        for (let i = 0; i < votes.length; i += chunkSize) {
            voteChunks.push(votes.slice(i, i + chunkSize));
            // Update progress bar
        }
        return voteChunks;
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
                            File has size <span>{voteBatch.size}b</span> with{' '}
                            <span>{voteBatch.text.split('\n').length}</span>{' '}
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
                    <Button onClick={onSubmit}>Senda in</Button>
                )}
                <PogressBarContainer>
                    <ProgressBar max={100} val={progress * 100}>
                        Progress is {progress * 100}%
                    </ProgressBar>
                </PogressBarContainer>
            </Message>
        </UploadVotesContainer>
    );
};
