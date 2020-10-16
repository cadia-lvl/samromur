import * as React from 'react';
import styled from 'styled-components';

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
    text-decoration: ${({ active }) => active ? 'underline' : 'none'};
    cursor: pointer;
`;

interface Props {
    className?: string;
    isAdmin: boolean;
    onSelect: (selected: string) => void;
    ref?: React.Ref<HTMLDivElement>;
    selected: string;
}

const DashboardSidePanel: React.FunctionComponent<Props> = ({ className, isAdmin, onSelect, selected }) => {

    const logout = () => {
        authApi.logout();
    }
    return (
        <SidePanelContainer className={className}>
            <Title>Mínar síður</Title>
            <Item active={selected == 'tolfraedi'} onClick={() => onSelect('tolfraedi')}>Tölfræði</Item>
            <Item active={selected == 'stillingar'} onClick={() => onSelect('stillingar')}>Stillingar</Item>
            { isAdmin && <Item active={selected == 'stjornandi'} onClick={() => onSelect('stjornandi')}>Stjórnandi</Item>}
            <Item active={false} onClick={logout}>Útskrá</Item>
        </SidePanelContainer>
    );
}

export default React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => <DashboardSidePanel {...props} ref={ref as any} />);