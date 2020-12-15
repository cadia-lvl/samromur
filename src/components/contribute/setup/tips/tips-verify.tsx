import * as React from 'react';
import WifiIcon from '../../../ui/icons/wifi';
import Balance from '../../../ui/icons/balance';
import styled from 'styled-components';
import Noise from '../../../ui/icons/noise';

import UserSpeakBubble from '../../../ui/icons/user-speak-bubble';
import CheckMarkCircle from '../../../ui/icons/check-mark-circle';
import LineGraph from '../../../ui/icons/line-graph';
import Tip from './tip';
import { theme } from '../../../../styles/global';

interface Props {}
const AudioContainer = styled.div`
    flex-basis: 40%;
    padding: 0 0.5rem;
`;

enum AudioColor {
    red = 'RED',
    green = 'GREEN',
}

interface ButtonProps {
    isPlaying: boolean;
    color: string;
}

const AudioButton = styled.div<ButtonProps>`
    width: auto;
    height: auto;
    cursor: pointer;
    background-color: ${({ isPlaying, theme, color }) =>
        isPlaying ? theme.colors.blue : color};
    color: white;
    padding: 0 10px;
    display: flex;
    align-theme: center;
    justify-content: center;
    text-align: center;
`;

const ExamplesContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: no-wrap;
    align-items: stretch;
`;

interface AudioProps {
    src: string;
    color?: AudioColor;
}

const Audio = styled.audio`
    display: none;
`;

const AudioPlayer: React.FC<AudioProps> = ({ src, color }) => {
    const audioRef = React.createRef<HTMLAudioElement>();
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handlePlayPause = () => {
        audioRef.current?.addEventListener('ended', () => {
            setIsPlaying(false);
        });
        if (isPlaying) {
            audioRef.current?.pause();
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };
    const getColorTheme = (): string => {
        if (color) {
            if (color === AudioColor.green) {
                return theme.colors.green;
            }
            if (color === AudioColor.red) {
                return theme.colors.red;
            }
        }
        return theme.colors.green;
    };
    return (
        <AudioContainer>
            <Audio ref={audioRef} src={src} />
            <AudioButton
                isPlaying={isPlaying}
                onClick={handlePlayPause}
                color={getColorTheme()}
            >
                {color === undefined || color === AudioColor.green
                    ? 'Spila góða upptöku'
                    : 'Spila slæma upptöku'}
            </AudioButton>
        </AudioContainer>
    );
};

export const TipsVerify: React.FC<Props> = () => (
    <div>
        <Tip
            icon={<Balance height={40} width={40} fill={'gray'} />}
            title={'Meginreglan'}
        >
            <p>
                Meginreglan er að það sem er lesið upp verður að stemma við
                textann sem birtist á skjánum. Það kemur fyrir að orð eru ekki
                lesinn rétt eða bara ekki lesin yfirhöfuð, þegar slíkt gerist á
                að merkja upptökuna sem slæma. Hér að neðan er dæmi um góð
                upptöku og svo slæma upptöku þar sem setningin „Þú þarft að fara
                út að leita“ er lesinn.
            </p>
            <ExamplesContainer>
                <AudioPlayer
                    src={
                        'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good1.wav'
                    }
                />
                <AudioPlayer
                    src={
                        'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Bad1.wav'
                    }
                    color={AudioColor.red}
                />
            </ExamplesContainer>
        </Tip>
        <Tip
            icon={<UserSpeakBubble height={40} width={40} fill={'gray'} />}
            title={'Brothljóð'}
        >
            <p>
                Það kemur fyrir að upptaka heppnist illa og innihaldi svokallað
                brothljóð. Þegar slíkt hljóð yfirgnæfir talið að miklu leiti á
                að merkja upptökuna sem slæma. Hér má heyra dæmi þar sem setning
                „Allir verkir eru í burt“ er lesinn.
            </p>
            <ExamplesContainer>
                <AudioPlayer
                    src={
                        'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good2.wav'
                    }
                />
            </ExamplesContainer>
        </Tip>
        <Tip
            icon={<Noise height={40} width={40} fill={'gray'} />}
            title={'Kliður/bakgrunnshljóð'}
        >
            <p>
                Við viljum að tækin okkar skilji okkur í þeim aðstæðum sem við
                erum í. Því er allt í lagi að það heyrist smá kliður eða
                bakgrunnshljóð. Svo lengi sem það yfirgnæfir ekki þann sem les.
                Hér dæmi um góða og slæma upptöku þar sem setningin „Þetta er
                ekkert grín“ er lesinn.
            </p>
            <ExamplesContainer>
                <AudioPlayer
                    src={
                        'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good3.wav'
                    }
                />
                <AudioPlayer
                    src={
                        'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Bad3.wav'
                    }
                    color={AudioColor.red}
                />
            </ExamplesContainer>
        </Tip>
    </div>
);

export default TipsVerify;
