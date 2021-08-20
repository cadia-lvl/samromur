import * as React from 'react';
import WifiIcon from '../../../ui/icons/wifi';
import SocialDistancingIcon from '../../../ui/icons/social-distancing';
import UserSpeakBubble from '../../../ui/icons/user-speak-bubble';
import CheckMarkCircle from '../../../ui/icons/check-mark-circle';
import LineGraph from '../../../ui/icons/line-graph';
import Tip from './tip';
import { useTranslation } from '../../../../server/i18n';

interface Props {}

export const TipsSpeak: React.FC<Props> = () => {
    const { t } = useTranslation('tips');
    return (
        <div>
            <Tip
                icon={
                    <SocialDistancingIcon
                        height={40}
                        width={40}
                        fill={'gray'}
                    />
                }
                title={t('two-meter-rule')}
            >
                <p>{t('two-meter-rule-text')}</p>
            </Tip>
            <Tip
                icon={<UserSpeakBubble height={40} width={40} fill={'gray'} />}
                title={t('review-recordings')}
            >
                <p>{t('review-recordings-text')}</p>
            </Tip>
            <Tip
                icon={<CheckMarkCircle height={40} width={40} fill={'gray'} />}
                title={t('like-reading-book')}
            >
                <p>{t('like-reading-book-text')}</p>
            </Tip>
            <Tip
                icon={<LineGraph height={40} width={40} fill={'gray'} />}
                title={t('one-or-thousand')}
            >
                <p>{t('one-or-thousand-text')}</p>
            </Tip>
            <Tip
                icon={<WifiIcon height={40} width={40} fill={'gray'} />}
                title={t('steady-connection')}
            >
                <p>{t('steady-connection-text')}</p>
            </Tip>
        </div>
    );
};

export default TipsSpeak;
