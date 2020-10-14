import * as React from 'react';
import styled from 'styled-components';

import DropdownArrowIcon from '../../ui/icons/dropdown-arrow';
import ShowMore from '../../ui/animated/show-more';

const InformationContainer = styled.div`
    width: 100%;
    padding-left: 1rem;
    align-items: center;
    border-left: 2px solid ${({ theme }) => theme.colors.blue};
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    cursor: pointer;

    & > * {
        margin: 0;
        color: ${({ theme }) => theme.colors.blue};
    }
`;

interface ReadMoreProps {
    active: boolean;
}

const ReadMoreContainer = styled(ShowMore) <ReadMoreProps>`
    & > * {
        margin: 0;
        margin-top: 0.5rem;
    }
`;

const Arrow = styled(DropdownArrowIcon) <ReadMoreProps>`
    margin-left: 1rem;
    transform-origin: bottom-right;
    transform: rotate(${({ active }) => active ? '180deg' : '0deg'});
    transition: transform 0.3s ${({ theme }) => theme.transitions.main};
`;

interface Props {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    title: string;
}


export const Information: React.FC<Props> = ({ children, className, ref, title }) => {
    const [readMore, setReadMore] = React.useState(false);

    const handleClick = () => {
        setReadMore(!readMore);
    }
    return (
        <InformationContainer className={className} ref={ref}>
            <TitleContainer onClick={handleClick}>
                <h6>{title}</h6>
                <Arrow height={10} width={10} active={readMore} fill={'blue'} />
            </TitleContainer>
            <ReadMoreContainer active={readMore}>
                {children}
            </ReadMoreContainer>
        </InformationContainer>
    );
}

export default React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => <Information {...props} ref={ref as any} />);