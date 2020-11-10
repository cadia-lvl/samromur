import * as React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

const MarkdownEditorContainer = styled.div`
    padding: 0.5rem;
    width: 64rem;
    max-width: 95vw;
    margin: 0 auto;
`;

interface Props {}

interface State {
    md: string;
}

export default class MarkdownEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            md: '',
        };
    }

    handleEditorChange = (it: { text: string; html: string }, event: any) => {
        this.setState({
            md: it.text,
        });
    };

    render() {
        const { md } = this.state;
        return (
            <MarkdownEditorContainer>
                <MdEditor
                    value={md}
                    onChange={this.handleEditorChange}
                    config={{
                        view: {
                            menu: true,
                            md: true,
                            html: true,
                            fullScreen: true,
                            hideMenu: true,
                        },
                        table: {
                            maxRow: 5,
                            maxCol: 6,
                        },
                        imageUrl:
                            'https://octodex.github.com/images/minion.png',
                        syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
                    }}
                    style={{
                        width: '100%',
                        height: '800px',
                        maxHeight: '50vh',
                    }}
                    renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                />
            </MarkdownEditorContainer>
        );
    }
}
