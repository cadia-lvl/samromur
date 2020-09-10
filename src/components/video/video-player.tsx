import * as React from 'react';
import styled from 'styled-components';

const VideoPlayerContainer = styled.div`

`;

interface Props {
    type: string;
    url: string;
}

interface State {

}

export default class VideoPlayer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }


    render() {
        const {
            type,
            url
        } = this.props;
        return (
            <VideoPlayerContainer>

            </VideoPlayerContainer>
        );
    }
}