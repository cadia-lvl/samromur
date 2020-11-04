import * as React from 'react';
import styled from 'styled-components';

const StatItemContainer = styled.div`
    padding: 1rem;
    background-color: white;
    //border: 1px solid ${({ theme }) => theme.colors.borderGray};
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.08);

    display: flex;
    flex-direction: column;
`;

const Line = styled.div`
    width: 100%;
    border-bottom: 2px solid ${({ theme }) => theme.colors.borderGray};
    margin-bottom: 2rem;
`;

const Title = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

interface Props {
    children?: React.ReactNode;
    className?: string;
    icon: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    title: string;
}

const StatsItem: React.FunctionComponent<Props> = ({
    children,
    className,
    icon,
    title,
}) => (
    <StatItemContainer className={className}>
        <Title>
            <h3>{title}</h3>
            {icon}
        </Title>
        <Line />
        {children}
    </StatItemContainer>
);

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <StatsItem {...props} ref={ref as any} />
    )
);
