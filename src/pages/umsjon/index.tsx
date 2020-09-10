import * as React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';

import Layout from '../../components/layout/layout';
import { Button } from '../../components/ui/buttons';
import Link from 'next/link';

const AdminContainer = styled.div`
    padding: 0.5rem;
    width: 64rem;
    margin: 0 auto;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

interface State {
    showAddSentences: boolean;
}

const dispatchProps = {

}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class AdminPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showAddSentences: false,
        }
    }

    static async getInitialProps({ store, isServer }: NextPageContext) {
        return ({
            namespacesRequired: ['common'],
        });
    }

    openContribute = () => {
        this.setState({ showAddSentences: true });
    }

    closeContribute = () => {
        this.setState({
            showAddSentences: false,
        });
    }

    render() {
        const {
            showAddSentences
        } = this.state;

        return (
            <Layout admin>
                <AdminContainer>
                    <ButtonsContainer>
                        <Link href='/umsjon/setningar'>
                            <Button large>
                                Setningar
                            </Button>
                        </Link>
                        <Link href='/umsjon/texti'>
                            <Button large>
                                Texti á vef
                        </Button>
                        </Link>
                    </ButtonsContainer>
                </AdminContainer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({

});

export default connect(
    mapStateToProps,
    dispatchProps
)(AdminPage);