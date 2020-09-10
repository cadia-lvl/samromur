import * as React from 'react';
import styled from 'styled-components';
import { UINotification } from '../../../types/ui';

interface Props {
    children?: React.ReactNode;
    className?: string;
    notification: UINotification;
    ref?: React.Ref<HTMLDivElement>;
}

const NotificationPillContainer = styled.div<Props>`
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-radius: 20px;
    opacity: 1;
    transition: opacity linear 2s;
    animation: fade-in 2s;
    background-color: ${({ notification, theme }) =>
        notification.error ? theme.colors.red : notification.success ? theme.colors.green : theme.colors.blue};
    color: white;
`;

export const NotificationPill: React.FunctionComponent<Props> = ({ children, className, notification, ref }) => {
    return (
        <NotificationPillContainer className={className} ref={ref} notification={notification}>
            {notification.text}
        </NotificationPillContainer>
    )
}

export default React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => <NotificationPill {...props} ref={ref as any} />);