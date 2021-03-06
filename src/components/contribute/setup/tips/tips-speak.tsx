import * as React from 'react';
import WifiIcon from '../../../ui/icons/wifi';
import SocialDistancingIcon from '../../../ui/icons/social-distancing';
import UserSpeakBubble from '../../../ui/icons/user-speak-bubble';
import CheckMarkCircle from '../../../ui/icons/check-mark-circle';
import LineGraph from '../../../ui/icons/line-graph';
import Tip from './tip';

interface Props {}

export const TipsSpeak: React.FC<Props> = () => (
    <div>
        <Tip
            icon={<SocialDistancingIcon height={40} width={40} fill={'gray'} />}
            title={'Tveggja metra reglan'}
        >
            <p>
                Það má ekki heyrast hátt í öðrum á meðan upptöku stendur og því
                þarf að halda fjarlægð frá öðrum. Oft duga tveir metrar til ef
                einstaklingar snúa frá hvor öðrum. Smá kliður í bakgrunni
                skemmir ekki fyrir en það má ekki yfirgnæfa upptökuna.
            </p>
        </Tip>
        <Tip
            icon={<UserSpeakBubble height={40} width={40} fill={'gray'} />}
            title={'Yfirfara upptökur'}
        >
            <p>
                Gott er að hlusta á fyrstu upptökurnar sínar til þess að passa
                að öll setningin heyrist og ekki séu neinir tæknilegir
                örðugleikar svo sem brakhljóð í upptöku.
            </p>
        </Tip>
        <Tip
            icon={<CheckMarkCircle height={40} width={40} fill={'gray'} />}
            title={'Þetta er eins og að lesa bók'}
        >
            <p>
                Þú getur ímyndað þér að þú sért að lesa bók upphátt, þó án
                leikrænna tilburða enda viljum við að tæki framtíðarinnar skilji
                okkar eðlilega talanda.
            </p>
        </Tip>
        <Tip
            icon={<LineGraph height={40} width={40} fill={'gray'} />}
            title={'Ein eða þúsund?'}
        >
            <p>
                Þú mátt lesa eins margar setningar og þú vilt. Því fleiri
                setningar sem þú lest því líklegra er að tækinn skilji rödd eins
                og þína betur.
            </p>
        </Tip>
        <Tip
            icon={<WifiIcon height={40} width={40} fill={'gray'} />}
            title={'Stöðug nettenging'}
        >
            <p>
                Til þess að tryggja að upptökurnar sendist inn er gott að vera
                með góða nettengingu.
            </p>
        </Tip>
    </div>
);

export default TipsSpeak;
