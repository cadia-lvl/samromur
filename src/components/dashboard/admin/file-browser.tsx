import * as React from 'react';
import styled from 'styled-components';

const Input = styled.input.attrs({
    accept: '.wav, .mp3, .txt',
    multiple: true,
    type: 'file',
})`
    display: none;
`;

const Click = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

interface Props {
    children?: React.ReactNode;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileBrowser: React.FunctionComponent<Props> = ({
    children,
    className,
    onChange,
}) => {
    const ref = React.createRef<HTMLInputElement>();

    const handleClick = () => {
        const { current: input } = ref;
        input?.click();
    };

    return (
        <Click className={className} onClick={handleClick}>
            <Input ref={ref} onChange={onChange} />
            {children}
        </Click>
    );
};

export default FileBrowser;
