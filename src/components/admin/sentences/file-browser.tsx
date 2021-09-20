import React, { EventHandler } from 'react';
import styled from 'styled-components';
import { SentenceBatch } from '../../../types/sentences';

const Input = styled.input`
    display: none;
`;

const ClickableDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
`;

interface Props {
    onFileChange: (sentenceBatch: SentenceBatch) => void;
}

interface State {
    file: File | null;
    filename: string;
    message: string;
}

export default class FileBrowser extends React.Component<Props, State> {
    private clickInput: React.RefObject<HTMLInputElement>;
    private allowed: Array<String>;

    constructor(props: Props) {
        super(props);
        this.state = {
            file: null,
            filename: '',
            message: '',
        };
        this.clickInput = React.createRef<HTMLInputElement>();
        this.allowed = ['.txt', '.tsv'];
    }

    isAllowed = (filename: string): boolean => {
        let extension = filename.match(/\.[^/.]+$/);
        return extension ? this.allowed.includes(extension[0]) : false;
    };

    handleResult = (file: any, result: string) => {
        const batch: SentenceBatch = {
            name: '',
            file: {
                name: file.name,
                size: file.size,
                text: result,
            },
        };
        this.props.onFileChange(batch);
    };

    handleChange = async (e?: any) => {
        if (this.state.file) {
            this.setState({
                file: null,
                filename: '',
                message: '',
            });
        } else if (this.isAllowed(e.target.value)) {
            const reader = new FileReader();
            const file = e.target.files[0];
            reader.addEventListener('load', () => {
                this.handleResult(file, reader.result as string);
            });
            reader.readAsText(e.target.files[0]);
        } else {
            console.error('Filetype not allowed');
            this.setState({
                message: 'Leyfðar skráarendingar eru: .txt, .tsv',
            });
        }
    };

    handleClick = () => {
        const { current: input } = this.clickInput;
        if (input) {
            input.click();
        }
    };

    render() {
        const { children } = this.props;
        return (
            <ClickableDiv onClick={this.handleClick}>
                <Input
                    type="file"
                    ref={this.clickInput}
                    onChange={this.handleChange}
                    accept=".txt,.tsv"
                />
                {children}
            </ClickableDiv>
        );
    }
}
