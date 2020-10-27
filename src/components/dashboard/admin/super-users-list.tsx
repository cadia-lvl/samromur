import * as React from 'react';
import styled from 'styled-components';

import * as adminApi from '../../../services/admin-api';
import { SuperUserStat } from '../../../types/user';

const ListContainer = styled.div`
    width: 100%;
    padding: 1rem;
    display: grid;
    grid-template-columns: 4fr 1fr;
`;

const HeaderSpan = styled.span`
    font-weight: 600;
`;

interface Props {
    stats: SuperUserStat[];
}

const SuperUsersList: React.FunctionComponent<Props> = ({ stats }) => {
    return (
        <ListContainer>
            <HeaderSpan>Notandi</HeaderSpan>
            <HeaderSpan>Staða</HeaderSpan>
            {stats.map((val, i: number) => 
                <React.Fragment key={i}>
                    <span>{val.email}</span>
                    <span>{val.count}</span>
                </React.Fragment>
            )}
        </ListContainer>
    );
}

export default SuperUsersList;