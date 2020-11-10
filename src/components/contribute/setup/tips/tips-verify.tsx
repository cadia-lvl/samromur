import * as React from "react";
import WifiIcon from "../../../ui/icons/wifi";
import SocialDistancingIcon from "../../../ui/icons/social-distancing";
import UserSpeakBubble from "../../../ui/icons/user-speak-bubble";
import CheckMarkCircle from "../../../ui/icons/check-mark-circle";
import LineGraph from "../../../ui/icons/line-graph";
import Tip from "./tip";

interface Props {}

export const TipsVerify: React.FC<Props> = () => (
    <div>
        <Tip
            icon={<SocialDistancingIcon height={40} width={40} fill={"gray"} />}
            title={"Tveggja metra reglan"}
        >
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                a sodales leo. Proin fringilla porttitor aliquam. Aliquam cursus
                elit ullamcorper quam vulputate vulputate. In hac habitasse
                platea dictumst.
            </p>
        </Tip>
        <Tip
            icon={<UserSpeakBubble height={40} width={40} fill={"gray"} />}
            title={"Yfirfara upptökur"}
        >
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                a sodales leo. Proin fringilla porttitor aliquam. Aliquam cursus
                elit ullamcorper quam vulputate vulputate. In hac habitasse
                platea dictumst.
            </p>
        </Tip>
        <Tip
            icon={<CheckMarkCircle height={40} width={40} fill={"gray"} />}
            title={"Lestu eins og þú lest bók"}
        >
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                a sodales leo. Proin fringilla porttitor aliquam. Aliquam cursus
                elit ullamcorper quam vulputate vulputate. In hac habitasse
                platea dictumst.
            </p>
        </Tip>
        <Tip
            icon={<LineGraph height={40} width={40} fill={"gray"} />}
            title={"Ein eða þúsund?"}
        >
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                a sodales leo. Proin fringilla porttitor aliquam. Aliquam cursus
                elit ullamcorper quam vulputate vulputate. In hac habitasse
                platea dictumst..
            </p>
        </Tip>
        <Tip
            icon={<WifiIcon height={40} width={40} fill={"gray"} />}
            title={"Stöðug nettenging"}
        >
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                a sodales leo. Proin fringilla porttitor aliquam. Aliquam cursus
                elit ullamcorper quam vulputate vulputate. In hac habitasse
                platea dictumst.
            </p>
        </Tip>
    </div>
);

export default TipsVerify;
