import * as React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 3px 1px rgba(0,0,0,.08);
    -moz-box-shadow: 0 0 3px 1px rgba(0,0,0,.08);
    -webkit-box-shadow: 0 0 3px 1px rgba(0,0,0,.08);

    display: flex;
    flex-direction: column;
`;

const Line = styled.div`
    width: 100%;
    border-bottom: 2px solid ${({ theme }) => theme.colors.borderGray};
`;


interface Props {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    title: string;
}

const Item: React.FunctionComponent<Props> = ({ children, className, title }) => (
    <ItemContainer className={className}>
        <h3>{title}</h3>
        <Line />
        {children}
    </ItemContainer>
)


export default React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => <Item {...props} ref={ref as any} />);