import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

import Recorder from './recorder';
import Card from './card';
import { WheelClip, ClipVote, UploadError } from '../../../types/samples';
import { AudioInfo, RecordingError } from '../../../types/audio';
import { WheelColor } from '../../../types/contribute';
import { WheelSentence } from '../../../types/sentences';
import {
    saveVote,
    SaveVoteRequest,
    uploadClip,
    UploadClipRequest,
    fetchClips,
    fetchSentences,
    FetchSamplesPayload,
} from '../../../services/contribute-api';

import {
    decrementProgress,
    incrementProgress,
    setExpanded,
} from '../../../store/contribute/actions';

import Instructions from './instructions';

import MainControls from './controls/main-controls';
import BottomControls from './controls/bottom-controls';

import WheelControls from './controls/wheel-controls';

interface WheelContainerProps {
    expanded: boolean;
}

const WheelContainer = styled.div<WheelContainerProps>`
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: ${({ theme }) => theme.layout.hudHeight} 40% auto auto auto auto;
    gap: 0.5rem;
    min-height: 40rem;
    height: 100vh;
    width: 100%;
    max-height: 100%;
    max-width: ${({ expanded, theme }) =>
        expanded ? '100vw' : theme.layout.gameWidth};
    transition: max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    justify-items: center;
    padding: 0 1rem;
    ${({ theme }) => theme.media.smallUp} {
        max-height: 60rem;
    }

    & > * {
        align-self: center;
    }
`;

const dispatchProps = {
    decrementProgress,
    incrementProgress,
    setExpanded,
};

interface CarouselWheelProps {
    sentences?: WheelSentence[];
    batch?: string;
    clips?: WheelClip[];
}

type Props = ReturnType<typeof mapStateToProps> &
    CarouselWheelProps &
    typeof dispatchProps;

interface State {
    sentences: WheelSentence[];
    clips: WheelClip[];
    clipIndex: number;
    color: WheelColor;
    isSpeak: boolean;
    sentenceIndex: number;
    recordingError?: RecordingError;
    uploadError?: UploadError;
    expanded: boolean;
}

class CarouselWheel extends React.Component<Props, State> {
    private recorder?: Recorder;
    private activeIndex: number;
    constructor(props: Props) {
        super(props);

        this.state = {
            sentences:
                this.props.sentences ||
                (this.props.clips &&
                    this.sentencesFromClips(this.props.clips)) ||
                [],
            color: WheelColor.BLUE,
            clips: this.props.clips || [],
            clipIndex: 0,
            isSpeak: !!this.props.sentences,
            sentenceIndex: 0,
            recordingError: undefined,
            uploadError: undefined,

            expanded: false,
        };

        this.activeIndex = 0;
    }

    setColor = (color: WheelColor) => {
        this.setState({ color });
    };

    sentencesFromClips = (clips: WheelClip[]): WheelSentence[] => {
        return clips.map((clip: WheelClip) => ({
            ...clip.sentence,
            removed: false,
            hasClip: false,
        }));
    };

    componentDidMount = async () => {
        if (!!this.props.sentences) {
            // To-do: Handle recording not supporteds
            // To-do: Stop microphone when idle to remove recording indicator from browser tab
            this.recorder = new Recorder();
            this.recorder.isRecordingSupported && (await this.recorder.init());
        }
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener(
            'beforeunload',
            this.handleOnBeforeUnload.bind(this)
        );
    };

    componentDidUpdate = async () => {
        const { clips, isSpeak, sentences } = this.state;
        if (isSpeak) {
            const notUsedSentences = sentences.filter(
                (sentence: WheelSentence) =>
                    !sentence.removed && !sentence.hasClip
            );
            notUsedSentences.length <= 10 && this.refreshSentences();
        } else {
            const nonVotedClips = clips.filter((clip: WheelClip) => !clip.vote);
            nonVotedClips.length <= 10 && this.refreshClips();
        }
    };

    refreshSentences = async () => {
        const { user } = this.props;
        const fetchRequest: FetchSamplesPayload = {
            clientId: user.client.id,
            count: 20,
        };
        const freshSentences = await fetchSentences(fetchRequest);
        const newSentences = this.state.sentences.concat(freshSentences);
        this.setState({ sentences: newSentences });
    };

    /**
     *  Fetches 20 new clips for verification from the db
     *  These are added to the state and updates the sentences
     */
    refreshClips = async () => {
        // To-do: test this
        const { batch, user } = this.props;
        const fetchRequest: FetchSamplesPayload = {
            batch,
            clientId: user.client.id,
            count: 20,
        };
        const freshClips = await fetchClips(fetchRequest);
        const newClips = this.getUniqueClips(
            this.state.clips.concat(freshClips)
        );

        // refresh sentences for the clips
        const newSentences = await this.sentencesFromClips(newClips);

        // To-do: change goal if when there are no more clips to get
        this.setState({ clips: newClips, sentences: newSentences });
    };

    /**
     * Takes in an array of clips that can include duplicates and returns
     * an array with no duplicates.
     * @param clips an array of WheelClips that might include duplicates
     */
    getUniqueClips = (clips: WheelClip[]) => {
        const seen = new Set();
        const filteredClips = clips.filter((clip: WheelClip) => {
            const duplicate = seen.has(clip.id);
            seen.add(clip.id);
            return !duplicate;
        });
        return filteredClips;
    };

    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener(
            'beforeunload',
            this.handleOnBeforeUnload.bind(this)
        );
    };

    handleOnBeforeUnload = (event: BeforeUnloadEvent) => {
        const {
            contribute: { goal, progress },
        } = this.props;
        const message =
            'Ef þú hættir núna glatast það sem þú ert búinn að taka upp.';
        if (progress > 0 && goal && goal.count != progress) {
            event.preventDefault();
            event.returnValue = message;
            return message;
        }
    };

    handleKeyDown = (event: KeyboardEvent) => {
        const { keyCode } = event;
        if (keyCode == 37) {
            this.onSpin(-1);
        } else if (keyCode == 39) {
            this.onSpin(1);
        }
    };

    /**
     *   Updates a clip in state and returns the updated clip
     */
    updateClip = async (
        index: number,
        update: { [type: string]: any }
    ): Promise<WheelClip> => {
        // Wait for array update before updating the state
        const newClips: WheelClip[] = await Promise.all(
            this.state.clips.map((clip, i) =>
                index == i
                    ? Promise.resolve({ ...clip, ...update })
                    : Promise.resolve(clip)
            )
        );

        this.setState({ clips: newClips });

        return Promise.resolve(newClips[index]);
    };

    /**
     *   Updates a clip in state and returns the updated clip
     */
    updateSentence = async (
        index: number,
        update: { [type: string]: any }
    ): Promise<void> => {
        // Wait for array update before updating the state
        const newSentences: WheelSentence[] = await Promise.all(
            this.state.sentences.map((sentence, i) =>
                index == i
                    ? Promise.resolve({ ...sentence, ...update })
                    : Promise.resolve(sentence)
            )
        );

        this.setState({ sentences: newSentences });

        return Promise.resolve();
    };

    onSpin = (offset: number, justRecorded?: boolean) => {
        // To-do: Beautify function
        if (offset == 0 || (this.recorder && this.recorder.isRecording)) {
            return;
        }
        const {
            clipIndex,
            expanded,
            sentenceIndex,
            clips,
            sentences,
        } = this.state;
        const {
            contribute: { goal },
        } = this.props;

        if (expanded) {
            return;
        }
        const numClips = clips.filter((clip: WheelClip) => !!clip.recording)
            .length;
        if (justRecorded && goal && numClips >= goal.count) {
            return;
        }

        if (goal && clipIndex + offset >= goal.count) {
            return;
        }

        // If positioned at the end of the wheel
        if (
            (sentenceIndex == 0 && offset < 0) ||
            (sentenceIndex == sentences.length - 1 && offset > 0)
        ) {
            setTimeout(() => this.setState({ sentenceIndex }), 150);
            this.setState({ sentenceIndex: sentenceIndex + offset });
            return;
        } else if (sentenceIndex < 0 || sentenceIndex > sentences.length - 1) {
            return;
        }

        if (offset > 0 && !justRecorded) {
            if (clipIndex + offset - 1 > clips.length - 1) {
                return;
            }
        }

        if (justRecorded) {
            if (
                clips[clipIndex + offset] &&
                !!clips[clipIndex + offset].recording
            ) {
                return;
            }
        }

        this.removeErrors();
        this.setState({
            sentenceIndex: sentenceIndex + offset,
            clipIndex: clipIndex + offset,
        });
    };

    removeErrors = () => {
        this.setState({
            recordingError: undefined,
            uploadError: undefined,
        });
    };

    handleRemoveRecording = async (): Promise<void> => {
        const { clipIndex } = this.state;
        await this.updateClip(clipIndex, {
            recording: undefined,
            uploadError: undefined,
            uploaded: undefined,
        });
        this.props.decrementProgress();
    };

    handleSkip = async () => {
        await this.updateSentence(this.activeIndex, { removed: true });
    };

    handleDeleteClip = async () => {
        // To-do: If it's a recording, remove it from database
        await this.handleRemoveRecording();
        await this.handleSkip();
    };

    handleSaveVote = async (vote: ClipVote): Promise<void> => {
        this.onSpin(1);
        const { clipIndex } = this.state;
        const clip = await this.updateClip(clipIndex, { vote });

        const {
            user: {
                client: { isSuperUser },
            },
        } = this.props;
        const payload = {
            clipId: clip.id as number,
            isSuper: isSuperUser,
            vote: clip.vote as ClipVote,
            voteId: clip.voteId,
        };
        if (!clip.voteId) {
            this.props.incrementProgress();
        }

        const voteId = await saveVote(payload);

        return this.updateClip(clipIndex, { voteId })
            .then(() => Promise.resolve())
            .catch((error) => Promise.reject(error));
    };

    handleStartRecording = async (): Promise<void> => {
        if (!this.recorder || !this.recorder.isRecordingSupported) {
            // To-do error handling
            console.error('Recording not supported.');
            return;
        }

        this.state.recordingError &&
            this.setState({ recordingError: undefined });

        return this.recorder.startRecording().catch((error) => {
            // To-do error handling
            console.error(error);
            return Promise.reject(error);
        });
    };

    saveClip = async (
        recording: AudioInfo,
        sentence: WheelSentence
    ): Promise<void> => {
        const clip = { recording, sentence };
        const { clips, clipIndex } = this.state;

        if (!!clips[clipIndex]) {
            await this.updateClip(clipIndex, { recording });
            return;
        }

        const newClips = this.state.clips.concat(clip);
        this.setState({
            clips: newClips,
        });

        await this.updateSentence(this.activeIndex, { hasClip: true });
        return Promise.resolve();
    };

    handleStopRecording = async (): Promise<void> => {
        if (!this.recorder) {
            console.error('No recorder, why am I here?');
            return;
        }

        return this.recorder
            .stopRecording()
            .then(async (recording: AudioInfo) => {
                const { clipIndex, sentences } = this.state;
                this.props.incrementProgress();
                await this.saveClip(recording, sentences[this.activeIndex]);
                this.handleUpload(clipIndex);
                this.onSpin(1, true);
                const {
                    contribute: { goal, progress },
                } = this.props;
                const isDone = !!(goal && goal.count == progress);
                if (!isDone) {
                    this.recorder?.initMicrophone();
                }
                return Promise.resolve();
            })
            .catch((error: RecordingError) => {
                this.setState({ recordingError: error });
                console.error(error);
            });
    };

    handleUpload = async (i: number): Promise<void> => {
        const clip = this.state.clips[i];
        const { user } = this.props;
        uploadClip(clip, user)
            .then((clipId: number) =>
                this.updateClip(i, { clipId, uploaded: true })
            )
            .catch((uploadError) => this.updateClip(i, { uploadError }));
    };

    setActiveIndex = (activeIndex: number) => {
        this.activeIndex = activeIndex;
    };

    handleExpand = () => {
        this.props.setExpanded(true);
    };

    handleContinue = () => {
        const { clips, isSpeak, sentences } = this.state;

        const newClips = isSpeak ? [] : clips.filter((clip) => !clip.vote);
        const newSentences = isSpeak
            ? sentences.filter(
                  (sentence) => !sentence.removed && !sentence.hasClip
              )
            : this.sentencesFromClips(newClips);
        this.activeIndex = 0;
        this.setState({
            clipIndex: 0,
            sentenceIndex: 0,
            clips: newClips,
            sentences: newSentences,
        });
    };

    render() {
        const {
            clips,
            clipIndex,
            color,
            isSpeak,
            sentenceIndex,
            recordingError,
            sentences,
        } = this.state;
        const {
            contribute: { expanded, gaming, goal, progress },
        } = this.props;
        const activeClip = clips[clipIndex] || undefined;
        const isDone = !!(
            (goal && goal.count == progress) ||
            // for when there are not enough clips to verify
            sentenceIndex === sentences.length - 1
        );

        let removeCounts = 0;

        return (
            <WheelContainer expanded={expanded}>
                <div />
                <div />
                {sentences.map((sentence: WheelSentence, i: number) => {
                    if (sentence.removed) {
                        removeCounts += 1;
                    }
                    const position = i - sentenceIndex - removeCounts;
                    if (position == 0) {
                        this.activeIndex = i;
                    }
                    return (
                        <Card
                            expanded={expanded}
                            onContinue={this.handleContinue}
                            key={i}
                            sentence={sentence}
                            onClick={() => this.onSpin(position)}
                            position={position}
                        />
                    );
                })}

                <WheelControls
                    clips={clips}
                    color={color}
                    index={clipIndex + 1}
                    isDone={isDone}
                    isSpeak={isSpeak}
                    spinTo={this.onSpin}
                />
                <Instructions
                    activeClip={activeClip}
                    isSpeak={isSpeak}
                    recordingError={recordingError}
                />
                <MainControls
                    clip={activeClip}
                    color={color}
                    isDone={isDone}
                    isSpeak={isSpeak}
                    deleteClip={this.handleDeleteClip}
                    saveVote={this.handleSaveVote}
                    setColor={this.setColor}
                    skipSentence={this.handleSkip}
                    startRecording={this.handleStartRecording}
                    stopRecording={this.handleStopRecording}
                    removeRecording={this.handleRemoveRecording}
                />
                <BottomControls
                    clip={activeClip}
                    isDone={isDone}
                    isSpeak={isSpeak}
                    deleteClip={this.handleDeleteClip}
                    saveVote={this.handleSaveVote}
                    skipSentence={this.handleSkip}
                    removeRecording={this.handleRemoveRecording}
                    handleSubmit={this.handleExpand}
                />
            </WheelContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    contribute: state.contribute,
    user: state.user,
});

export default connect(mapStateToProps, dispatchProps)(CarouselWheel);
