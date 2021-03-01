import * as React from 'react';
import styled from 'styled-components';

import * as adminApi from '../../../services/admin-api';

import FileBrowser from './file-browser';
import UploadMetadata from './upload-metadata';
import ProgressBar from './progress-bar';
import { formatBytes, verifyFiles } from '../../../utilities/upload-helper';
import { RepeatSentencesMetadata } from './repeat-sentences-metadata';

const UploadAudioBatchContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;

    & > * {
        margin-bottom: 1rem;
    }
`;

export const BrowseBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const Status = styled.div`
    display: flex;
    align-items: center;

    & span {
        font-weight: 600;
        margin: 0 0.3rem;
    }
`;

export const Button = styled.div`
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

export const Message = styled.div`
    font-size: 1.3rem;
`;

const InformationText = styled.span`
    font-size: 1rem;
`;

const Bold = styled(InformationText)`
    font-weight: 600;
`;

export enum UploadType {
    VERIFICATION_BATCH,
    REPEAT_SENTENCES,
    SENTENCES,
}

interface UploadAudioBatchProps {
    uploadType: UploadType;
}

interface State {
    error: string;
    files?: File[];
    fileCount: number;
    progress: number;
    progressTotal: number;
    uploading: boolean;
    finished: boolean;
    labels: string[];
    totalSize: number;
    successCount: number;
}

type Props = UploadAudioBatchProps;

class UploadAudioBatch extends React.Component<Props, State> {
    private reader!: FileReader;
    constructor(props: Props) {
        super(props);

        this.state = {
            error: '',
            files: undefined,
            progress: 0,
            progressTotal: 0,
            uploading: false,
            finished: false,
            fileCount: -1,
            labels: [],
            totalSize: -1,
            successCount: -1,
        };
    }

    componentDidMount = async () => {
        const labels = await adminApi.fetchVerificationLabels();
        this.setState({ labels });
    };

    onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
            const verified = verifyFiles(files);
            const fileCount = verified.length;
            const totalSize = verified.reduce(
                (total, value) => total + value.size,
                0
            );
            this.setState({ files: verified, fileCount, totalSize });
        }
    };

    getDropdownLabels = (): string[] => {
        const { labels } = this.state;
        const values = labels.map((value: string) =>
            value == 'samromur' ? 'Almennt' : value
        );
        return values.concat('Búa til nýjan');
    };

    onProgress = (ev: ProgressEvent) => {
        this.setState({
            progress: ev.loaded,
            progressTotal: ev.total,
        });
    };

    onSubmit = (
        age: string,
        dialect: string,
        gender: string,
        nativeLanguage: string,
        label: string
    ) => {
        const { files } = this.state;
        if (!files || !label) {
            return;
        }
        this.setState({ uploading: true });
        adminApi
            .uploadVerificationBatch(
                files,
                age,
                dialect,
                gender,
                nativeLanguage,
                label,
                this.onProgress
            )
            .then((successCount: number) => {
                this.setState({
                    finished: true,
                    successCount,
                    files: undefined,
                    fileCount: -1,
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    error: 'Eitthvað fór úrskeiðis',
                    finished: true,
                    files: undefined,
                    fileCount: -1,
                });
            });
    };

    onSubmitRepeat = (packageName: string) => {
        const { files } = this.state;
        if (!files || !packageName) {
            return;
        }
        adminApi
            .uploadRepeatSentences(files, packageName, this.onProgress)
            .then((successCount: number) => {
                this.setState({
                    finished: true,
                    successCount,
                    files: undefined,
                    fileCount: -1,
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    error: 'Eitthvað fór úrskeiðis',
                    finished: true,
                    files: undefined,
                    fileCount: -1,
                });
            });
    };

    render() {
        const {
            error,
            fileCount,
            progress,
            progressTotal,
            uploading,
            finished,
            totalSize,
            successCount,
        } = this.state;

        const { uploadType } = this.props;

        const labels = this.getDropdownLabels();
        return (
            <UploadAudioBatchContainer>
                <BrowseBar>
                    <Status>
                        {fileCount > 0 && (
                            <React.Fragment>
                                Fann <span>{fileCount / 2}</span> skrár{' '}
                                <span>með</span> setningar, samtals{' '}
                                <span>{formatBytes(totalSize)}</span>
                            </React.Fragment>
                        )}
                    </Status>
                    <FileBrowser onChange={this.onChange}>
                        <Button>Velja skrár</Button>
                    </FileBrowser>
                </BrowseBar>
                {finished && (
                    <Message>
                        {error ? (
                            <span>{error}</span>
                        ) : uploadType === UploadType.VERIFICATION_BATCH ? (
                            <span>Setti inn {successCount} upptökur</span>
                        ) : (
                            <span>
                                Setti inn {successCount} setningar með upptökur
                            </span>
                        )}
                    </Message>
                )}
                {fileCount > 0 ? (
                    uploadType === UploadType.VERIFICATION_BATCH ? (
                        <UploadMetadata
                            labels={labels}
                            onSubmit={this.onSubmit}
                        />
                    ) : (
                        <RepeatSentencesMetadata
                            onSubmit={this.onSubmitRepeat}
                        />
                    )
                ) : (
                    <Message>
                        {uploadType === UploadType.VERIFICATION_BATCH ? (
                            <InformationText>
                                Hlaða inn skrám á sniðinu <Bold> id.txt</Bold>{' '}
                                og samsvarandi
                                <Bold> id.wav</Bold>. id.txt ættu að innihalda
                                öll nauðsynleg metadata fyrir upptökur.
                            </InformationText>
                        ) : (
                            <InformationText>
                                Hlaða inn skrám á sniðinu <Bold>id.txt</Bold> og
                                samsvarandi <Bold>id.wav</Bold>. id.txt ættu
                                aðeins að innihalda setningu.
                            </InformationText>
                        )}
                    </Message>
                )}
                {uploading && !finished && (
                    <ProgressBar val={progress} max={progressTotal} />
                )}
            </UploadAudioBatchContainer>
        );
    }
}

export default UploadAudioBatch;
