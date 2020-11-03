import * as React from 'react';
import styled from 'styled-components';

import { WheelClip, ClipVote } from '../../../../types/samples';
import {
    PlayButton,
    PauseButton,
    RetryButton,
    Button,
} from '../../../ui/buttons';

const AudioContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-self: center;
    align-items: center;
    & > div {
        margin: 1rem;
    }
`;

const Audio = styled.audio`
    display: none;
`;

interface Props {
    clip: WheelClip;
    updateClip: (update: { [type: string]: any }) => Promise<WheelClip>;
    saveVote: (vote: ClipVote) => Promise<void>;
}

interface State {
    isPlaying: boolean;
}

export default class ListenControls extends React.Component<Props, State> {
    private audioRef: React.RefObject<HTMLAudioElement>;
    constructor(props: Props) {
        super(props);

        this.state = {
            isPlaying: false,
        };

        this.audioRef = React.createRef<HTMLAudioElement>();
    }

    play = () => {
        const { current: audio } = this.audioRef;
        if (audio != null) {
            if (!this.state.isPlaying) {
                audio.play();
                this.setState({
                    isPlaying: true,
                });
            }
        }
    };

    pause = () => {
        const { current: audio } = this.audioRef;
        if (audio != null) {
            if (this.state.isPlaying) {
                audio.pause();
                audio.currentTime = 0;
                this.setState({
                    isPlaying: false,
                });
            }
        }
    };

    render() {
        const { clip, saveVote } = this.props;
        const { isPlaying } = this.state;

        return (
            <AudioContainer>
                <Audio
                    ref={this.audioRef}
                    preload="auto"
                    controls
                    controlsList="nodownload"
                    onEnded={this.pause}
                    src={clip.recording && clip.recording.url}
                />
                <Button onClick={() => saveVote(ClipVote.VALID)}>Góð</Button>
                <PlayButton
                    onClickHandler={isPlaying ? this.pause : this.play}
                    icon={{
                        height: 50,
                        width: 50,
                    }}
                    isPlaying={isPlaying}
                />
                <Button onClick={() => saveVote(ClipVote.INVALID)}>Slæm</Button>
            </AudioContainer>
        );
    }
}
