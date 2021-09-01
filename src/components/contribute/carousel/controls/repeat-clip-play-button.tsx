import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Url } from 'url';
import { ContributeType, WheelColor } from '../../../../types/contribute';
import PauseIcon from '../../../ui/icons/pause';
import PlayIcon, { Play } from '../../../ui/icons/play';
import { Glow } from './glow';
import { connect } from 'react-redux';
import { setHasPlayedRepeatClip } from '../../../../store/contribute/actions';
import RootState from '../../../../store/root-state';
import { ContributeState } from '../../../../store/contribute/state';
import { KeyCommands } from '../../../../constants/keyboardCommands';

interface PlayButtonProps {
    isActive?: boolean;
}

const PlayButton = styled.div<PlayButtonProps>`
    margin-right: 5rem;
    display: grid;
    & :hover {
        & > div {
            opacity: 1;
        }
    }
    ${({ isActive }) =>
        isActive
            ? `opacity:1;`
            : `
            opacity:0.5;
            pointer-events: none;
            `}
    transition: opacity .5s ease-in-out;
`;

const RelativeGlow = styled(Glow)`
    position: relative;
    grid-column: 1;
    grid-row: 1;
    z-index: 0;
`;

const RelativePlayIcon = styled(PlayIcon)``;

const RelativePlayIconContainer = styled.div`
    margin: auto;
    grid-column: 1;
    grid-row: 1;
    z-index: 1;
    background-color: white;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const dispatchProps = {
    setHasPlayedRepeatClip,
};

interface RepeatClipPlayButtonProps {
    src: string | undefined;
    contribute: ContributeState;
    isActive: boolean;
}
type Props = RepeatClipPlayButtonProps & typeof dispatchProps;

const RepeatClipPlayButton: React.FunctionComponent<Props> = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(new Audio(props.src));

    // Use effect to update the audio source when the props change.
    useEffect(() => {
        if (props.src) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
            audio.src = props.src;
            props.setHasPlayedRepeatClip(false);
        }
    }, [props.src]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const { key } = e;

            if (key === KeyCommands.PlayRepeatClip) {
                handleTogglePlay();
            }
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    //when clip ends, change icon of button
    audio.onended = () => {
        setIsPlaying(false);
        props.setHasPlayedRepeatClip(true);
    };

    const handleTogglePlay = () => {
        // check if the playrepeatclip button is active or not
        if (!props.isActive) return;

        setIsPlaying(!isPlaying);

        if (isPlaying) {
            //deactive
            audio.pause();
            return;
        }
        audio.play();
    };

    return (
        //show stop button while playing repeated clip and stop button when playing clip
        <PlayButton
            onClick={handleTogglePlay}
            isActive={props.isActive}
            title={'Hlustaðu á upptökuna (A)'}
            tabIndex={0}
        >
            <RelativePlayIconContainer>
                {isPlaying ? (
                    <PauseIcon height={35} width={35} fill={'green'} />
                ) : (
                    <RelativePlayIcon height={35} width={35} fill={'green'} />
                )}
            </RelativePlayIconContainer>
            <RelativeGlow color={WheelColor.GREEN} />
        </PlayButton>
    );
};

const mapStateToProps = (state: RootState) => {
    const contribute = state.contribute;
    return { contribute };
};

export default connect(mapStateToProps, dispatchProps)(RepeatClipPlayButton);
