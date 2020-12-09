import * as React from 'react';
import WifiIcon from '../../../ui/icons/wifi';
import Balance from '../../../ui/icons/balance';
import styled from 'styled-components';
import Noise from '../../../ui/icons/noise';

import UserSpeakBubble from '../../../ui/icons/user-speak-bubble';
import CheckMarkCircle from '../../../ui/icons/check-mark-circle';
import LineGraph from '../../../ui/icons/line-graph';
import Tip from './tip';

interface Props {}
const AudioContainer = styled.div``;

interface ButtonProps {
    isPlaying: boolean;
}

const AudioButton = styled.div<ButtonProps>`
    width: auto;
    height: auto;
    cursor: pointer;
    background-color: ${({ isPlaying, theme }) =>
        isPlaying ? theme.colors.green : theme.colors.blue};
    color: white;
    padding-left: 10px;
    
`;

interface AudioProps {
    src: string;
}

const Audio = styled.audio`
    display: none;
`;

const AudioPlayer: React.FC<AudioProps> = ({ src }) => {
    const audioRef = React.createRef<HTMLAudioElement>();
    const [isPlaying, setIsPlaying] = React.useState(false);
    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };
    return (
        <AudioContainer>
            <Audio ref={audioRef} src={src}/>
            <AudioButton isPlaying={isPlaying} onClick={handlePlayPause}>
                Spila upptöku
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
                textann sem birtist á skjánum. Það kemur fyrir að orð eru ekki lesinn rétt eða 
                eða bara ekki lesin yfirhöfuð, þegar slíkt gerist á að merkja upptökuna
                sem slæma. 
                

                Hér er að neðan er dæmi um góð upptöku og svo slæma upptöku þar sem setningin
                „Þú þarft að fara út að leita“ er lesinn.
            </p>
            <AudioPlayer
                src={
                    'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good1.wav'
                }
                />
            <AudioPlayer
                src={
                    'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Bad1.wav'
                }
            />
        </Tip>
        <Tip
            icon={<UserSpeakBubble height={40} width={40} fill={'gray'} />}
            title={'Brothljóð'}
        >
            <p>
                Það kemur fyrir að upptaka heppnist illa og innihaldi svokallað
                brothljóð. Þegar slíkt hljóð yfirgnæfir talið að miklu leiti á að 
                merkja upptökuna sem slæma. 

                
                Hér má heyra dæmi þar sem setning „Allir verkir eru í burt“
                er lesinn.
            </p>
            <AudioPlayer
                src={
                    'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good2.wav'
                }
            />
        </Tip>
        <Tip
            icon={<Noise height={40} width={40} fill={'gray'} />}
            title={'Kliður/bakgrunnshljóð'}
        >
            <p>
                Við viljum að tækin okkar skilji okkur í þeim aðstæðum sem við
                erum í. Því er allt í lagi að það heyrist smá kliður eða
                bakgrunnshljóð. Svo lengi sem það yfirgnæfir ekki þann sem les.
                
                Hér er dæmi um góða og slæma upptöku þar sem setningin „Þetta er 
                ekkert grín“ er lesinn.
            </p>
            <AudioPlayer
                src={
                    'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good3.wav'
                }
                />
            <AudioPlayer
                src={
                    'https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Bad3.wav'
                }
            />
        </Tip>
    </div>
);

export default TipsVerify;
