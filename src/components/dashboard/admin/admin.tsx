import * as React from 'react';
import styled from 'styled-components';

import * as adminApi from '../../../services/admin-api';
import { SuperUserStat } from '../../../types/user';

import Item from './item';
import SuperUser from './super-user';
import SuperUsersList from './super-users-list';

const AdminContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(auto-fill, auto);
    gap: 2rem;
    padding: 2rem;

    ${({ theme }) => theme.media.small} {
        grid-template-columns: 100%;
    }
`;

interface AdminProps {}

interface State {
    stats: SuperUserStat[];
}

type Props = AdminProps;

class DashboardAdmin extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            stats: [],
        };
    }

    componentDidMount = async () => {
        const stats = await adminApi.fetchSuperUsers();
        this.setState({ stats });
    };

    render() {
        const { stats } = this.state;
        return (
            <AdminContainer>
                <Item title={'Búa til ofurnotanda'}>
                    <SuperUser />
                </Item>
                <Item title={'Ofurnotendur'}>
                    <SuperUsersList stats={stats} />
                </Item>
            </AdminContainer>
        );
    }
}

export default DashboardAdmin;
