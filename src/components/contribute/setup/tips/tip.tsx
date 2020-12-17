import * as React from 'react';
import styled from 'styled-components';

import DropdownArrowIcon from '../../../ui/icons/dropdown-arrow';
import ShowMore from '../../../ui/animated/show-more';
import { IconProps } from '../../../ui/icons/icon';

const TipContainer = styled.div`
    border-left: 3px solid ${({ theme }) => theme.colors.borderGray};
    width: 100%;
`;

export const NoSelectDiv = styled.div`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const TitleContainer = styled(NoSelectDiv)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    gap: 1rem;
    padding: 1rem;
    font-size: 1.5rem;
    & > * {
        margin: 0;
    }

    & span {
        margin-left: 1rem;
    }
`;

const AlignLeftContainer = styled(NoSelectDiv)`
    display: flex;
    justify-content: left;
`;
interface ReadMoreProps {
    active: boolean;
}

const ReadMoreContainer = styled(ShowMore)<ReadMoreProps>`
    padding: 0 1rem;
    & > * {
        margin: 0;
        margin-top: 0.5rem;
    }
`;

const Icon = styled(NoSelectDiv)``;

const Arrow = styled(DropdownArrowIcon)<ReadMoreProps>`
    margin-left: 1rem;
    transform-origin: bottom-right;
    transform: rotate(${({ active }) => (active ? '180deg' : '0deg')});
    transition: transform 0.3s ${({ theme }) => theme.transitions.main};
`;

interface Props {
    children?: React.ReactNode;
    className?: string;
    icon: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    title: string;
}

export const Tip: React.FC<Props> = ({
    children,
    className,
    icon,
    ref,
    title,
}) => {
    const [readMore, setReadMore] = React.useState(false);

    const handleClick = () => {
        setReadMore(!readMore);
    };

    return (
        <TipContainer className={className} ref={ref}>
            <TitleContainer onClick={handleClick}>
                <AlignLeftContainer>
                    <Icon>{icon}</Icon>
                    <span>{title}</span>
                </AlignLeftContainer>
                <Arrow height={15} width={15} active={readMore} fill={'gray'} />
            </TitleContainer>
            <ReadMoreContainer active={readMore}>{children}</ReadMoreContainer>
        </TipContainer>
    );
};

export default React.forwardRef(
    (props: Props, ref: React.Ref<HTMLDivElement>) => (
        <Tip {...props} ref={ref as any} />
    )
);
