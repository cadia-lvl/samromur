import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { SentenceBatch } from '../../../types/sentences';
import FileBrowser from '../../admin/sentences/file-browser';
import * as adminApi from '../../../services/admin-api';
import { Vote, VoteBatchFile } from '../../../types/votes';
import { ClipVote } from '../../../types/samples';

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

const ErrorMessage = styled(Message)`
    color: ${({ theme }) => theme.colors.red};
    font-weight: 600;
`;

const InformationText = styled.div`
    font-size: 1rem;
`;

enum UploadErrors {
    VOTE_NOT_BOOLEAN = 1,
    SUPER_VOTE_NOT_BOOLEAN,
    NOT_THREE_COLUMNS,
    CLIPID_NOT_NUMBER,
    NO_BATCH,
    NO_BATCH_ID,
}

export const UploadVotes: React.FunctionComponent = () => {
    const [voteBatch, setVoteBatch] = useState<VoteBatchFile | undefined>(
        undefined
    );
    const [uploaded, setUploaded] = useState(false);
    const [error, setError] = useState<UploadErrors | undefined>(undefined);

    const onChange = (batch: SentenceBatch): void => {
        const voteBatchFile: VoteBatchFile = batch.file;
        setVoteBatch(voteBatchFile);
        // Reset error and upload state
        setError(undefined);
        setUploaded(false);
    };

    const onSubmit = async () => {
        // Clear eventual errors
        setError(undefined);

        // Verify the batch file
        if (verifyBatch() && voteBatch) {
            startUpload();
        }
    };

    const startUpload = async () => {
        if (!voteBatch) {
            setError(UploadErrors.NO_BATCH);
            return;
        }

        // Process file to managable object
        const votes: Array<Vote> = convertFileToVotesArray(voteBatch);
        const batchId = await adminApi.addVotesBatch(votes);

        if (batchId) {
            setUploaded(true);
            // Start insert vote process
            adminApi.insertVotesFromBatch(batchId);
        } else {
            setError(UploadErrors.NO_BATCH_ID);
        }
    };

    const convertFileToVotesArray = (voteBatch: VoteBatchFile): Array<Vote> => {
        const votesArray: Array<string> = voteBatch.text.split('\n');
        const votes: Array<Vote> = votesArray.map((item) => {
            const values = item.split('\t');
            const clipVote =
                parseInt(values[1]) == 1 ? ClipVote.VALID : ClipVote.INVALID;
            const vote: Vote = {
                clipId: parseInt(values[0]),
                vote: clipVote,
                isSuper: parseInt(values[2]) == 1,
            };
            return vote;
        });
        return votes;
    };

    /**
     * Verifies that the selected batch is on the correct form
     */
    const verifyBatch = (): boolean => {
        let result = true;

        if (!voteBatch) {
            setError(UploadErrors.NO_BATCH);
            return (result = false);
        }
        const fileLines: Array<string> = voteBatch.text.split('\n');

        for (let line of fileLines) {
            // Check correct length of each line
            const items = line.split('\t');
            if (items.length !== 3) {
                setError(UploadErrors.NOT_THREE_COLUMNS);
                return (result = false);
            }

            // Check that clipid are number
            if (isNaN(Number(items[0]))) {
                setError(UploadErrors.CLIPID_NOT_NUMBER);
                return (result = false);
            }

            // Check that the vote is 0 or 1
            if (![0, 1].includes(Number(items[1]))) {
                setError(UploadErrors.VOTE_NOT_BOOLEAN);
                return (result = false);
            }

            // Check that the super vote is 0 or 1
            if (![0, 1].includes(Number(items[2]))) {
                setError(UploadErrors.SUPER_VOTE_NOT_BOOLEAN);
                return (result = false);
            }
        }
        return result;
    };

    const getErrorMessage = (): string => {
        switch (error) {
            case UploadErrors.CLIPID_NOT_NUMBER:
                return 'A clipid is not a number.';
            case UploadErrors.NO_BATCH:
                return 'No file found.';
            case UploadErrors.NOT_THREE_COLUMNS:
                return 'A row does not have 3 columns.';
            case UploadErrors.VOTE_NOT_BOOLEAN:
                return 'A vote has another value than 0 or 1.';
            case UploadErrors.SUPER_VOTE_NOT_BOOLEAN:
                return 'A super vote has another value than 0 or 1';
            case UploadErrors.NO_BATCH_ID:
                return 'No batch id returned from the server.';
            default:
                return 'Unknown error occurred.';
        }
    };

    // A very crude estimate of the upload time
    const getExpectedUploadTimeMinutes = () => {
        if (voteBatch) {
            const numberOfVotes = voteBatch.text.split('\n').length;
            const votesPerSecond = 200;
            return (numberOfVotes / votesPerSecond / 60).toFixed(2);
        }
        return 0;
    };

    return (
        <UploadVotesContainer>
            <BrowseBar>
                <Status>
                    {voteBatch && (
                        <React.Fragment>
                            {/* TODO: Add format bytes here when it is moved to utils (herma) */}
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
            {!uploaded && (
                <Message>
                    {!voteBatch ? (
                        <InformationText>
                            Upload votes in a tab separated file with clipid
                            <kbd>tab</kbd>
                            vote<kbd>tab</kbd>is_super.
                        </InformationText>
                    ) : (
                        <Button onClick={onSubmit}>Senda in</Button>
                    )}
                </Message>
            )}
            {uploaded && (
                <Message>
                    File uploaded! Expected time to insert into db is:{' '}
                    {getExpectedUploadTimeMinutes()} minutes.
                </Message>
            )}
            {error && <ErrorMessage>Error: {getErrorMessage()}</ErrorMessage>}
        </UploadVotesContainer>
    );
};
