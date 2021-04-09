import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Url } from 'url';
import { ContributeType, WheelColor } from '../../../../types/contribute';
import PauseIcon from '../../../ui/icons/pause';
import PlayIcon, { Play } from '../../../ui/icons/play';
import { Glow } from './glow';

const PlayButton = styled.div`
    margin-right: 5rem;
    display: grid;
    & :hover {
        & > div {
            opacity: 1;
        }
    }
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

interface Props {
    src: string | undefined;
}

export const RepeatClipPlayButton: React.FunctionComponent<Props> = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(new Audio(props.src));

    // Use effect to update the audio source when the props change.
    useEffect(() => {
        if (props.src) {
            audio.src = props.src;

        }
    }, [props.src]);
    //when clip ends, change icon of button
    audio.onended = () => {
      setIsPlaying(false);
    }

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            audio.pause();

            return;
        } 
        audio.play();


    };

    return (
      //show stop button while playing repeated clip and stop button when playing clip
        <PlayButton onClick={handleTogglePlay}>
            <RelativePlayIconContainer>
              {
                isPlaying ? <PauseIcon height={35} width={35} fill={'green'}  />

                  :
                  <RelativePlayIcon height={35} width={35} fill={'green'} />
              }
              </RelativePlayIconContainer>
              <RelativeGlow color={WheelColor.GREEN} />
        </PlayButton>
    );
};
