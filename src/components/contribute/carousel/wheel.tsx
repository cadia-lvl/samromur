import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

import Recorder from './recorder';
import Card from './card';
import { WheelClip, ClipVote, UploadError, Clip } from '../../../types/samples';
import { AudioInfo, RecordingError, AudioError } from '../../../types/audio';
import { ContributeType, WheelColor } from '../../../types/contribute';
import { SimpleSentence, WheelSentence } from '../../../types/sentences';
import {
    saveVote,
    SaveVoteRequest,
    uploadClip,
    UploadClipRequest,
    fetchClips,
    fetchSentences,
    FetchSamplesPayload,
    fetchClipsToRepeat,
} from '../../../services/contribute-api';

import {
    decrementProgress,
    incrementProgress,
    setExpanded,
    setGoal,
} from '../../../store/contribute/actions';

import { Instructions } from './instructions';

import MainControls from './controls/main-controls';
import BottomControls from './controls/bottom-controls';

import WheelControls from './controls/wheel-controls';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { KeyCommands } from '../../../constants/keyboardCommands';

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
    ${({ theme }) => theme.media.extraSmallDown} {
        grid-template-rows: ${({ theme }) => theme.layout.hudHeight} 30% auto auto auto auto;
        min-height: 10rem;
    }
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
    setGoal,
};

interface CarouselWheelProps {
    sentences?: WheelSentence[];
    batch?: string;
    clips?: WheelClip[];
    contributeType?: ContributeType;
    clipsToRepeat?: Clip[];
}

type Props = ReturnType<typeof mapStateToProps> &
    CarouselWheelProps &
    typeof dispatchProps;

interface State {
    sentences: WheelSentence[];
    clips: WheelClip[];
    clipsToRepeat?: WheelClip[];
    clipIndex: number;
    color: WheelColor;
    isSpeak: boolean;
    sentenceIndex: number;
    recordingError?: RecordingError;
    audioError?: AudioError;
    uploadError?: UploadError;
    expanded: boolean;
    outOfClips?: boolean;
}

class CarouselWheel extends React.Component<Props, State> {
    private recorder?: Recorder;
    private activeIndex: number;
    private batchSize = 20;
    constructor(props: Props) {
        super(props);

        this.state = {
            sentences:
                this.props.sentences ||
                (this.props.clips
                    ? this.sentencesFromClips(this.props.clips)
                    : this.props.clipsToRepeat &&
                      this.sentencesFromClips(this.props.clipsToRepeat)) ||
                [],
            color: WheelColor.BLUE,
            clips: this.props.clips || [],
            clipsToRepeat: this.props.clipsToRepeat,
            clipIndex: 0,
            isSpeak: this.props.contributeType !== ContributeType.LISTEN,
            sentenceIndex: 0,
            recordingError: undefined,
            audioError: undefined,
            uploadError: undefined,

            expanded: false,
            outOfClips: false,
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
        const { isSpeak } = this.state;
        if (isSpeak) {
            // To-do: Stop microphone when idle to remove recording indicator from browser tab
            this.recorder = new Recorder();
            try {
                this.recorder.isRecordingSupported &&
                    (await this.recorder.init());
            } catch (error) {
                if (error in AudioError) {
                    this.setState({ audioError: error });
                }
            }
        }
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('beforeunload', this.handleOnBeforeUnload);
    };

    componentDidUpdate = async () => {
        const {
            clips,
            isSpeak,
            sentences,
            clipsToRepeat,
            outOfClips,
        } = this.state;
        if (isSpeak) {
            const notUsedSentences = sentences.filter(
                (sentence: WheelSentence) =>
                    !sentence.removed && !sentence.hasClip
            );

            if (notUsedSentences.length <= 10 && !outOfClips) {
                clipsToRepeat
                    ? this.refreshClipsToRepeat()
                    : this.refreshSentences();
            }
        } else {
            const nonVotedClips = clips.filter((clip: WheelClip) => !clip.vote);

            if (nonVotedClips.length <= 10 && !outOfClips) {
                this.refreshClips();
            }
        }
    };

    /**
     * This function is responsible for acquireing new clips to repeat
     * from the database for the herma workflow.
     * It fetches new clips from the db, filters out any duplicates and
     * and updates the sentences from them.
     */
    refreshClipsToRepeat = async () => {
        const { clipsToRepeat, sentences } = this.state;
        const freshClipsToRepeat: WheelClip[] = await this.fetchNewClipsToRepeat();

        if (clipsToRepeat) {
            const newClipsToRepeat = this.getUniqueClipsToRepeat(
                clipsToRepeat.concat(freshClipsToRepeat)
            );

            // get sentences for the new clips
            const freshSentences = await this.sentencesFromClips(
                newClipsToRepeat.slice(clipsToRepeat.length)
            );
            const newSentences = sentences.concat(freshSentences);

            // If fewer than batchSize, then we are running out of clips
            if (freshClipsToRepeat.length < this.batchSize) {
                this.handleOutOfClips(newClipsToRepeat.length);
            }

            this.setState({
                clipsToRepeat: newClipsToRepeat,
                sentences: newSentences,
            });
        }
    };

    /**
     * Fetches new clips to repeat form the db.
     * @returns a batchSize of clips to repeat for the herma workflow from the db.
     */
    fetchNewClipsToRepeat = async (): Promise<WheelClip[]> => {
        const { user, batch } = this.props;

        const fetchRequest: FetchSamplesPayload = {
            batch,
            clientId: user.client.id,
            count: this.batchSize,
        };

        const clipsToRepeat = await fetchClipsToRepeat(fetchRequest);

        return clipsToRepeat;
    };

    /**
     * This function handles what should happen when we have run out of clips
     * for verification or for herma
     */
    handleOutOfClips = (clipsLeft: number) => {
        const {
            contribute: { goal },
            contributeType,
            setGoal,
        } = this.props;
        const { clipsToRepeat, clips } = this.state;

        // Update state
        this.setState({ outOfClips: true });

        if (goal) {
            setGoal({ ...goal, count: clipsLeft });
        }
    };

    refreshSentences = async () => {
        const freshSentences = await this.fetchNewSentences();
        const newSentences = this.state.sentences.concat(freshSentences);
        this.setState({ sentences: newSentences });
    };

    fetchNewSentences = async (): Promise<WheelSentence[]> => {
        const {
            user: {
                client,
                demographics: { age, nativeLanguage },
            },
        } = this.props;

        const fetchRequest: FetchSamplesPayload = {
            clientId: client.id,
            age: age?.id,
            nativeLanguage: nativeLanguage?.id,
            count: this.batchSize,
        };
        const freshSentences = await fetchSentences(fetchRequest);
        return freshSentences;
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
            count: this.batchSize,
        };
        const freshClips = await fetchClips(fetchRequest);

        const newClips = this.getUniqueClips(
            this.state.clips.concat(freshClips)
        );

        // If fewer than batchSize, then we are running out of clips
        if (freshClips.length < this.batchSize) {
            this.handleOutOfClips(newClips.length);
        }

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

    /**
     * Takes in an array of clipsToRepeat that can include duplicates and returns
     * an array with no duplicates. Finds duplicates via the sentence of the clip.
     * @param clips an array of WheelClips that might include duplicates
     */
    getUniqueClipsToRepeat = (clips: WheelClip[]) => {
        const seen = new Set();
        const filteredClipsToRepeat = clips.filter((clip: WheelClip) => {
            const duplicate = seen.has(clip.sentence.id);
            seen.add(clip.sentence.id);
            return !duplicate;
        });
        return filteredClipsToRepeat;
    };

    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('beforeunload', this.handleOnBeforeUnload);
    };

    handleOnBeforeUnload = (event: BeforeUnloadEvent) => {
        const {
            contribute: { goal, progress, gaming },
        } = this.props;
        const message =
            'Ef þú hættir núna glatast það sem þú ert búinn að taka upp.';
        if (gaming && progress > 0 && goal && goal.count != progress) {
            event.preventDefault();
            event.returnValue = message;
            return message;
        }
    };

    handleKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        const { isSpeak, sentences, expanded } = this.state;
        // If in the expanded state, don't allow these keyboard commands
        if (expanded) {
            return;
        }
        switch (key) {
            case KeyCommands.SpinBackward:
                this.onSpin(-1);
                break;
            case KeyCommands.SpinForward:
                this.onSpin(1);
                break;
            case KeyCommands.VoteUnsure:
                if (!isSpeak) this.handleSaveVote(ClipVote.UNSURE);
                break;
            case KeyCommands.DeleteRecording:
                if (isSpeak) this.handleDeleteClip();
                break;
            case KeyCommands.Rerecord:
                if (isSpeak) this.handleRemoveRecording();
                break;
            case KeyCommands.Skip:
                if (isSpeak && !sentences[this.activeIndex].hasClip)
                    this.handleSkip();
                break;
            case KeyCommands.Submit:
                this.handleExpand();
                break;
            default:
                break;
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
            audioError: undefined,
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
        if (!this.recorder?.isRecording) {
            await this.updateSentence(this.activeIndex, { removed: true });
        }
    };

    handleDeleteClip = async () => {
        // TODO: implement call to db to delete recording, or mark as bad!
        const { clipIndex, clips } = this.state;
        // filter out the active clip from the clips array and update state
        const newClips = clips.filter((clip, index) => index !== clipIndex);
        this.setState({ clips: newClips });

        // Decrement progress
        this.props.decrementProgress();

        await this.handleSkip();
    };

    handleSaveVote = async (vote: ClipVote): Promise<void> => {
        const { clipIndex } = this.state;
        const clip = await this.updateClip(clipIndex, { vote });
        this.onSpin(1);

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

    /**
     * Using the recorder to start recording the microphone input.
     * Initialize the microphone and start recording.
     */
    handleStartRecording = async (): Promise<void> => {
        // Reset errors
        this.state.audioError && this.setState({ audioError: undefined });
        this.state.recordingError &&
            this.setState({ recordingError: undefined });

        // check if recorder exists and is supported
        if (!this.recorder || !this.recorder.isRecordingSupported) {
            this.setState({ audioError: AudioError.NO_SUPPORT });
            console.error(AudioError.NO_SUPPORT);
            return Promise.reject(AudioError.NO_SUPPORT);
        }

        // Initialize microphone and start recording
        try {
            await this.recorder.initMicrophone();
            await this.recorder.startRecording();
        } catch (error) {
            if (error in AudioError) {
                this.setState({ audioError: error });
            }
            console.error(error);
            return Promise.reject(error);
        }
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

    /**
     * Stops the current ongoing recording of the recorder.
     * Then saves and uploads the current clip to the database and
     * takes the user to the next item in the wheel.
     */
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
                return Promise.resolve();
            })
            .catch((error: RecordingError) => {
                this.setState({ recordingError: error });
                console.error(error);
            });
    };

    handleUpload = async (i: number): Promise<void> => {
        const clip = this.state.clips[i];
        const { user, contributeType } = this.props;
        const isRepeated = contributeType === ContributeType.REPEAT;

        uploadClip(clip, user, isRepeated)
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

    /**
     * Handles what should happen if the user have finished a contribution
     * and want to continue with the same type of contribution.
     * Filters out deleted/skipped/used/voted/recorded clips and sentences
     * and resets the indexes
     */
    handleContinue = () => {
        const { clips, isSpeak, sentences, clipsToRepeat } = this.state;
        const { contributeType } = this.props;

        const newClips = isSpeak ? [] : clips.filter((clip) => !clip.vote);
        const newSentences = isSpeak
            ? sentences.filter(
                  (sentence) => !sentence.removed && !sentence.hasClip
              )
            : this.sentencesFromClips(newClips);
        const newClipsToRepeat =
            contributeType === ContributeType.REPEAT
                ? this.filterOutUsedSentences(clipsToRepeat, newSentences)
                : undefined;
        this.activeIndex = 0;
        this.setState({
            clipIndex: 0,
            sentenceIndex: 0,
            clips: newClips,
            sentences: newSentences,
            clipsToRepeat: newClipsToRepeat,
        });
    };

    /**
     * Takes in the clips to repeat and filters out the used sentences
     * @param clipsToRepeat the clips to repeat in state
     * @param newSentences the new sentences that have filtered out used and removed onee
     * @returns an array of clips to repeat that matches the new sentences
     */
    filterOutUsedSentences(
        clipsToRepeat: WheelClip[] | undefined,
        newSentences: WheelSentence[]
    ): WheelClip[] {
        // Return empty array if no input array
        if (!clipsToRepeat) {
            return [];
        }
        const newClipsToRepeat = clipsToRepeat.filter((clip) =>
            newSentences.some(
                (sentence) => sentence.text === clip.sentence.text
            )
        );
        return newClipsToRepeat;
    }

    //function to build array for non skipped sentences
    getActualClipToRepeat = (): WheelClip | undefined => {
        const { sentences, sentenceIndex, clipsToRepeat } = this.state;
        //if there is no clip to repeat, return undifined
        if (!clipsToRepeat) {
            return undefined;
        }
        //otherwise
        let nonSkippedIndex = [];
        for (let i = 0; i < sentences.length; i++) {
            if (!sentences[i].removed) {
                nonSkippedIndex.push(i);
                if (nonSkippedIndex.length > sentenceIndex) {
                    break;
                }
            }
        }
        //return the clip in the index saved in the new array made for non skipped sentences.
        return clipsToRepeat[nonSkippedIndex[sentenceIndex]];
    };

    render() {
        const {
            clips,
            clipsToRepeat,
            clipIndex,
            color,
            isSpeak,
            sentenceIndex,
            recordingError,
            audioError,
            sentences,
        } = this.state;
        const {
            contribute: { expanded, gaming, goal, progress },
        } = this.props;
        const activeClip = clips[clipIndex] || undefined;
        const activeClipToRepeat = this.getActualClipToRepeat();
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
                    audioError={audioError}
                />
                <MainControls
                    clip={activeClip}
                    clipToRepeat={activeClipToRepeat}
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
                    progress={progress}
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
