import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../server/i18n';

import * as authApi from '../../services/auth-api';

const SidePanelContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h4`
    ${({ theme }) => theme.media.small} {
        display: none;
    }
`;
interface ItemProps {
    active: boolean;
}

const Item = styled.span<ItemProps>`
    font-size: 1.2rem;
    text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
    cursor: pointer;
`;

interface Props {
    className?: string;
    isAdmin: boolean;
    onSelect: (selected: string) => void;
    ref?: React.Ref<HTMLDivElement>;
    selected: string;
}

const DashboardSidePanel: React.FunctionComponent<Props> = ({
    className,
    isAdmin,
    onSelect,
    selected,
}) => {
    const logout = () => {
        authApi.logout();
    };
    const { t } = useTranslation(['my-pages', 'common']);
    return (
        <SidePanelContainer className={className}>
            <Title>Mínar síður</Title>
            <Item
                active={selected == 'tolfraedi'}
                onClick={() => onSelect('tolfraedi')}
            >
                {t('side-panel.statistics')}
            </Item>
            <Item
                active={selected == 'stillingar'}
                onClick={() => onSelect('stillingar')}
            >
                {t('side-panel.settings')}
            </Item>
            {isAdmin && (
                <Item
                    active={selected == 'stjornandi'}
                    onClick={() => onSelect('stjornandi')}
                >
                    {t('side-panel.administrative')}
                </Item>
            )}
            <Item active={false} onClick={logout}>
                {t('common:sign-out')}
            </Item>
        </SidePanelContainer>
    );
};

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <DashboardSidePanel {...props} ref={ref as any} />
    )
);
