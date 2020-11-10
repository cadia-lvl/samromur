import * as React from "react";
import WifiIcon from "../../../ui/icons/wifi";
import Balance from "../../../ui/icons/balance";
import styled from 'styled-components';
import Noise from '../../../ui/icons/noise';

import UserSpeakBubble from "../../../ui/icons/user-speak-bubble";
import CheckMarkCircle from "../../../ui/icons/check-mark-circle";
import LineGraph from "../../../ui/icons/line-graph";
import Tip from "./tip";

interface Props {}
const AudioContainer = styled.div`
`;
 
interface ButtonProps {
    isPlaying: boolean;
}
 
const AudioButton = styled.div<ButtonProps>`
    width: auto;
    height: auto;
    cursor: pointer;
    background-color: ${({ isPlaying, theme }) => isPlaying ? theme.colors.green : theme.colors.blue};
    color: white;
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
    }
    return (
        <AudioContainer>
            <Audio
                ref={audioRef}
                src={src}
            />
            <AudioButton
                isPlaying={isPlaying}
                onClick={handlePlayPause}
            >
                Spila upptöku
            </AudioButton>
        </AudioContainer>
    );
}

export const TipsVerify: React.FC<Props> = () => (
    <div>
        <Tip
            icon={<Balance height={40} width={40} fill={"gray"} />}
            title={"Meginreglan"}>
            <p>
            Meginreglan er að það sem heyrist í upptökunni verður að stemma við það 
            sem stendur í textanum. Heyra dæmi um góða upptöku „Þú þarft að fara út að leita“:
            </p>
            <AudioPlayer src={"https://s3.eu-west-2.amazonaws.com/static.samromur.is/good_bad/Good1.wav"}/>
        </Tip>
        <Tip
            icon={<UserSpeakBubble height={40} width={40} fill={"gray"} />}
            title={"Brothljóð"}>
            <p>
                Það getur komið fyrir að upptaka takist ekki fullkomlega og það kemur 
                hljóð sem má kalla brothljóð. Slíkar upptökur á að merkja sem slæmar.
                Heyra dæmi um góða upptöku „Allir verkir eru í burt“:
            </p>
        <AudioPlayer src={"https://s3.eu-west-2.amazonaws.com/samromur.is/76afc108-683b-4c1f-9434-004f1ecc4e87/acdbce3bd86185c770e812cc2c2d37f340c20a976e9d3ceb0c912ccbbceca3a5.wav"} />
        </Tip>
        <Tip
            icon={<Noise height={40} width={40} fill={"gray"} />}
            title={"Kliður/bakgrunnshljóð"}>
            <p>
                Við viljum að tækin okkar skilji okkur í þeim aðstæðum sem við erum í. Því er allt í lagi að það heyrist
                smá kliður eða bakgrunnshljóð. Svo lengi sem það yfirgnæfir ekki þann sem er að lesa upp. 
                Heyra dæmi um góða upptöku „Þakka honum þannig án þess að þakka honum beinlinis sem væri harðbannað“:
            </p>
            <AudioPlayer src={"https://s3.eu-west-2.amazonaws.com/samromur.is/e7dba315-7839-4e35-bfe5-30964d691328/a99ca87dab5615a0cca46af5c7fdafc4b39a324b72efe31da2d360402c47e7ee.wav"} />
        </Tip>
    </div>
);

export default TipsVerify;
