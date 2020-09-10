import { FunctionComponent } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const MarkdownContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 0 auto;
    padding: 1rem;
    line-height: 1.2;
    
    & h1 {
        margin: 1rem 0;
        font-size: 1.6rem;
        font-weight: bold;
        text-decoration: underline;
    }

    & h2 {
        margin: 1rem 0;
        font-size: 1.5rem;
    }

    & a {
        text-decoration: none;
        outline: none;
        color: ${({ theme }) => theme.colors.blue};
    }

    padding-bottom: 1rem;
`;


export const MarkdownArticle: FunctionComponent<{ text: string }> = ({ text }) => {
    return (
        <MarkdownContainer>
            <ReactMarkdown>{text}</ReactMarkdown>
        </MarkdownContainer>
    );
}

export default MarkdownArticle