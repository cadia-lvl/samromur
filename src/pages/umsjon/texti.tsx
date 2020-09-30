import * as React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

import Layout from '../../components/layout/layout';
import MarkdownEditor from '../../components/admin/text/markdown-editor';

const TextPageContainer = styled.div`
    padding: 0.5rem;
    width: 64rem;
    max-width: 95vw;
    margin: 0 auto;
`;


interface State {

}

const dispatchProps = {

}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class TextPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    static async getInitialProps({ store, isServer }: NextPageContext) {
        return ({
            namespacesRequired: ['common'],
        });
    }

    render() {

        return (
            <Layout>
                <TextPageContainer>
                    <MarkdownEditor />
                </TextPageContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({

});

export default connect(
    mapStateToProps,
    dispatchProps
)(TextPage);