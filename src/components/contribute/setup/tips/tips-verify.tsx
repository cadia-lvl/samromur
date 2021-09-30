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
import { useTranslation } from '../../../../server/i18n';

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
    height: 100%;
    cursor: pointer;
    background-color: ${({ isPlaying, theme, color }) =>
        isPlaying ? theme.colors.blue : color};
    color: white;
    padding: 0 10px;
    padding-bottom 3px;
    padding-top 3px;
    display: flex;
    align-theme: center;
    justify-content: center;
    align-items: center;
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
    const { t } = useTranslation('tips');

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
            });
            if (isPlaying) {
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
            } else {
                audio.muted = false;
                audio.play();
                setIsPlaying(true);
            }
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
                    ? t('play-good-recording')
                    : t('play-bad-recording')}
            </AudioButton>
        </AudioContainer>
    );
};

export const TipsVerify: React.FC<Props> = () => {
    const { t } = useTranslation('tips');
    return (
        <div>
            <Tip
                icon={<Balance height={40} width={40} fill={'gray'} />}
                title={t('main-review-rule')}
            >
                <p>{t('main-review-rule-text')}</p>
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
                title={t('sound-artifacts')}
            >
                <p>{t('sound-artifacts-text')}</p>
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
                title={t('background-noise')}
            >
                <p>{t('background-noise-text')}</p>
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
};

export default TipsVerify;
