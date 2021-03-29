import * as React from 'react';
import styled from 'styled-components';

import PlayIcon from '../../../ui/icons/play';
import MicIcon from '../../../ui/icons/mic';
import PauseIcon from '../../../ui/icons/pause';
import ThumbUpIcon from '../../../ui/icons/thumb-up';
import ThumbDownIcon from '../../../ui/icons/thumb-down';
import { WheelClip, ClipVote } from '../../../../types/samples';
import { WheelColor } from '../../../../types/contribute';
import {
    getWheelColorString,
    getWheelColorHEXShades,
} from '../../../../utilities/color-utility';

import Wave from '../wave';
import { RepeatClipPlayButton } from './repeat-clip-play-button';
import { Glow } from './glow';

const Audio = styled.audio`
    display: none;
`;

const MainControlsContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    & canvas {
        position: absolute;
        width: 100% !important;
        mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 3%,
            black,
            rgba(0, 0, 0, 0) 97%
        );
    }
`;

interface MainButtonContainerProps {
    isActive: boolean;
}

const MainButtonContainer = styled.div<MainButtonContainerProps>`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    ${({ isActive }) =>
        isActive &&
        `
        & > div {
            opacity: 1;
        }
    `}
    & :hover {
        & > div {
            opacity: 1;
        }
    }
`;

interface MainButtonProps {
    hasRecording?: boolean;
}

const MainButton = styled.div<MainButtonProps>`
    position: relative;
    width: 5rem;
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
    ${({ hasRecording }) => hasRecording && `padding-left: 0.2rem;`}
`;

interface VoteButtonProps {
    active: boolean;
    color: string;
}

const VoteButton = styled.div<VoteButtonProps>`
    position: relative;
    width: 4rem;
    height: 3rem;
    margin: 0 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({ active, color, theme }) =>
        active ? theme.colors[color] : 'white'};
    border-radius: 2rem;
    cursor: pointer;
    & :active {
        transform: translateY(1px);
    }
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
`;

interface Props {
    clip?: WheelClip;
    clipToRepeat?: WheelClip;
    color: WheelColor;
    isDone: boolean;
    isSpeak: boolean;
    deleteClip: () => void;
    setColor: (color: WheelColor) => void;
    saveVote: (vote: ClipVote) => Promise<void>;
    skipSentence: () => void;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    removeRecording: () => Promise<void>;
}

interface State {
    hasPlayed: boolean;
    isPlaying: boolean;
    isReplaying: boolean;
    isRecording: boolean;
    isStartingRecording: boolean;
}

export default class MainControls extends React.Component<Props, State> {
    private audioRef: React.RefObject<HTMLAudioElement>;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private wave?: Wave;
    constructor(props: Props) {
        super(props);

        this.state = {
            hasPlayed: false,
            isPlaying: false,
            isReplaying: false,
            isRecording: false,
            isStartingRecording: false,
        };

        this.audioRef = React.createRef<HTMLAudioElement>();
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    private startWaving = () => {
        const { color } = this.props;
        const canvas = this.canvasRef.current;
        this.wave?.pause();
        if (canvas) {
            return new Wave(canvas, color);
        } else {
            return;
        }
    };

    componentDidMount = () => {
        this.wave = this.startWaving();
    };

    componentDidUpdate = (prevProps: Props) => {
        const oldHasRecording = !!prevProps.clip && !!prevProps.clip.recording;
        const hasRecording = !!this.props.clip && !!this.props.clip.recording;
        const oldVote = !!prevProps.clip && !!prevProps.clip.vote;
        const newVote = !!this.props.clip && !!this.props.clip.vote;

        const recordingChanged = oldHasRecording != hasRecording;
        const clipChanged = prevProps.clip != this.props.clip;
        const voteChanged = oldVote != newVote;

        if (clipChanged) {
            this.setState({
                hasPlayed: false,
                isPlaying: false,
                isReplaying: false,
            });
        }

        if (
            recordingChanged ||
            voteChanged ||
            this.props.isDone != prevProps.isDone
        ) {
            const color = this.selectColor();
            this.props.setColor(color);
        }

        const oldColor = prevProps.color;
        const newColor = this.props.color;
        if (oldColor != newColor) {
            this.wave?.setColor(newColor);
        }
    };

    selectColor = () => {
        const { isDone, isSpeak, clip } = this.props;
        if (isDone) {
            return WheelColor.GREEN;
        } else {
            if (isSpeak) {
                if (clip && clip.recording) {
                    return WheelColor.RED;
                } else {
                    return WheelColor.BLUE;
                }
            } else {
                if (clip && clip.vote) {
                    return WheelColor.GRAY;
                } else {
                    return WheelColor.BLUE;
                }
            }
        }
    };

    handlePlay = () => {
        const { current: audio } = this.audioRef;
        if (audio != null) {
            const { isPlaying, isReplaying } = this.state;
            const { clip } = this.props;
            if (!isPlaying) {
                audio.muted = false;
                audio.play();
                this.setState({
                    isPlaying: true,
                });
                const hasVote = !!clip?.vote;
                if (hasVote && !isReplaying) {
                    this.setState({ isReplaying: true });
                    this.props.setColor(WheelColor.BLUE);
                    setTimeout(() => this.wave?.play(), 50);
                } else {
                    this.wave?.play();
                }
            }
        }
    };

    handleHasPlayed = () => {
        this.setState({ hasPlayed: true, isReplaying: false });
        const { isSpeak } = this.props;
        !isSpeak && this.props.setColor(WheelColor.GRAY);
        this.handlePause();
    };

    handlePause = () => {
        const { current: audio } = this.audioRef;
        if (audio != null) {
            if (this.state.isPlaying) {
                audio.pause();
                audio.currentTime = 0;
                this.setState({
                    isPlaying: false,
                });
                this.wave?.pause();
            }
        }
    };

    /**
     * Activates when the start recording button is clicked.
     * Sets the state to recording, starts the wave effect and
     * runs the startRecording prop function.
     */
    handleStartRecording = () => {
        const { isStartingRecording } = this.state;
        if (isStartingRecording) {
            return;
        }

        this.setState({ isStartingRecording: true });

        this.props
            .startRecording()
            .then(() => {
                this.setState({ isStartingRecording: false });
                this.setState({ isRecording: true });
                this.wave?.play();
            })
            .catch((error) => {
                this.setState({ isStartingRecording: false });
                console.error(error);
            });
    };

    handleStopRecording = () => {
        this.props.stopRecording().then(() => {
            this.setState({ isRecording: false });
            this.wave?.pause();
        });
    };

    handleDelete = () => {
        this.props.deleteClip();
    };

    handleSaveVote = (vote: ClipVote) => {
        const { hasPlayed } = this.state;
        const { clip, saveVote, setColor } = this.props;
        if (hasPlayed || clip?.voteId) {
            this.setState({ hasPlayed: false });
            setColor(WheelColor.BLUE);
            saveVote(vote);
        }
    };

    render() {
        const { clip, color, isSpeak, clipToRepeat } = this.props;
        const { hasPlayed, isPlaying, isRecording, isReplaying } = this.state;

        const hasRecording = clip && !!clip.recording;
        const hasRepeatClip = !!clipToRepeat;
        const clipVote = clip?.vote;
        const colorString = getWheelColorString(color);

        const validActive =
            (clipVote == ClipVote.VALID || hasPlayed) && !isReplaying;
        const invalidActive =
            (clipVote == ClipVote.INVALID || hasPlayed) && !isReplaying;

        return (
            <MainControlsContainer>
                <canvas ref={this.canvasRef} />
                <Audio
                    ref={this.audioRef}
                    preload="auto"
                    controls
                    controlsList="nodownload"
                    onEnded={this.handleHasPlayed}
                    src={clip && clip.recording && clip.recording.url}
                />

                {!isSpeak && (
                    <VoteButton
                        color={'green'}
                        active={validActive}
                        onClick={() => this.handleSaveVote(ClipVote.VALID)}
                    >
                        <ThumbUpIcon
                            fill={validActive ? 'white' : 'gray'}
                            height={30}
                            width={30}
                        />
                    </VoteButton>
                )}
                {hasRepeatClip && (
                  <RepeatClipPlayButton
                      src={
                          clipToRepeat &&
                          clipToRepeat.recording &&
                          clipToRepeat.recording.url
                      }
                  />
              )}

              {!isSpeak && (
                  <VoteButton
                      color={'red'}
                      active={invalidActive}
                      onClick={() => this.handleSaveVote(ClipVote.INVALID)}
                  >
                      <ThumbDownIcon
                          fill={invalidActive ? 'white' : 'gray'}
                          height={30}
                          width={30}
                      />
                  </VoteButton>
              )}
              <MainButtonContainer isActive={isRecording || isPlaying}>
                  <Glow color={color} />

                  {hasRecording ? (
                      <MainButton
                          hasRecording
                          onClick={
                              !isPlaying ? this.handlePlay : this.handlePause
                          }
                      >
                          {!isPlaying ? (
                              <PlayIcon
                                  fill={colorString}
                                  height={35}
                                  width={35}
                              />
                          ) : (
                              <PauseIcon
                                  fill={colorString}
                                  height={35}
                                  width={35}
                              />
                          )}
                      </MainButton>
                  ) : (
                      // When speaking and not having a recording
                      <MainButton
                          onClick={
                              isRecording
                                  ? this.handleStopRecording
                                  : this.handleStartRecording
                          }
                      >
                          {!isRecording ? (
                              <MicIcon
                                  fill={colorString}
                                  height={35}
                                  width={35}
                              />
                          ) : (
                              <PauseIcon
                                  fill={colorString}
                                  height={35}
                                  width={35}
                              />
                          )}
                      </MainButton>  
                )}
            </MainButtonContainer>
          </MainControlsContainer>
        );
    }
}
