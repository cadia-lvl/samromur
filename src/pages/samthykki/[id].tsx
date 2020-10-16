import * as React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import { withTranslation, WithTranslation } from '../../server/i18n';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";
import Link from 'next/link';

import * as consentsApi from '../../services/consents-api';

import Layout from '../../components/layout/layout';

const ConsentPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    
    & > * {
        margin-bottom: 1.4rem;
    }
    width: 100%;
    max-width: 35rem;
    padding: 1rem;
    margin: 0 auto;
    margin-top: 2.5rem;
`;

const Button = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.colors.green};
    font-size: 1.3rem;
    cursor: pointer;

    & span {
        color: white;
    }

    :active {
        transform: translateY(2px);
    }
`;

type Props = WithRouterProps & WithTranslation;

interface State {
    done: boolean;
    success: boolean;
}

class ConsentPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            done: false,
            success: false
        }
    }

    static async getInitialProps(ctx: NextPageContext) {
        return ({
            namespacesRequired: ['common'],
        });
    }

    componentDidMount = async () => {
        const { router: { query: { id } } } = this.props;

        // Remove the ugly uuid query from address bar
        history.pushState("", document.title, document.URL.replace(id as string, ''));

        const success = await consentsApi.addPermission(id as string);
        console.log(success);
        this.setState({
            done: true,
            success
        });
    }

    render() {
        const { done, success } = this.state;
        return (
            <Layout>
                <ConsentPageContainer>
                    <h2>
                        {
                            (done && !success)
                                ?
                                'Mistókst að veita samþykki'
                                :
                                'Samþykki veitt'
                        }
                    </h2>
                    <span>
                        Takk fyrir að veita leyfi fyrir þátttöku í Samróm. Tilvera íslenskrar tungu stendur og fellur með því að börn og unglingar noti tungumálið. Það gerum við með því að tryggja að tæknin skilji raddir barna og unglinga, sem nú þegar tala við flest sín tæki á ensku. Raddir barna og unglinga eru afar frábrugðnar röddum fullorðinna. Til að tryggja að tækin skilji alla er brýnt að raddir allra Íslendinga verði til í gagnasafni Samróms.
                    </span>
                    <Link href='/'>
                        <Button>
                            <span>
                                Áfram
                            </span>
                        </Button>
                    </Link>
                </ConsentPageContainer>
            </Layout>
        );
    }
}

export default withTranslation('common')(withRouter(ConsentPage));