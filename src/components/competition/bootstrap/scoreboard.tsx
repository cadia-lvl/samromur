import * as React from 'react';
import { useEffect, useState } from 'react';
import BootStrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import styled from 'styled-components';
import useSWR from 'swr';
import { getCompetitionScores } from '../../../services/competition-api';
import { ScoreboardData } from '../../../types/competition';
import Loader from '../../ui/animated/loader';
import paginationFactory from 'react-bootstrap-table2-paginator';

const Box = styled.div`
    box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 1px;
    border: 1px solid rgb(249, 249, 249);
`;

const ScoreboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
`;

const columns = [
    {
        dataField: 'rank',
        text: '*',
        sort: true,
        // headerStyle: () => {
        //     return { width: '10%' };
        // },
        headerAlign: 'left',
        align: 'left',
    },
    {
        dataField: 'name',
        text: 'Company name',
        sort: true,
        // headerStyle: () => {
        //     return { width: '70%' };
        // },
        align: 'center',
        headerAlign: 'center',
    },
    {
        dataField: 'size',
        text: 'Company size',
        sort: true,
        hidden: true,
    },
    {
        dataField: 'users',
        text: 'Users',
        sort: true,
        hidden: true,
    },
    {
        dataField: 'count',
        text: 'Count',
        sort: true,
        align: 'right',
        headerAlign: 'right',
        // headerStyle: () => {
        //     return { width: '20%' };
        // },
    },
];

const expandRows = {
    renderer: (row: ScoreboardData) => (
        <div>
            <p>{`${row.name} has contributed with an amazing ${row.count} utterances.`}</p>
            <p>{`The company/team is of ${row.size} size and has so far ${row.users} individual contributors`}</p>
        </div>
    ),
};

const defaultData = new Array<ScoreboardData>();

const dummyData: ScoreboardData[] = [
    { rank: 1, name: 'Company X', size: 'medium', count: 1, users: 100 },
];

const sizes = ['small', 'medium', 'large', 'xlarge'];

const generateDummyData = (amount: number): ScoreboardData[] => {
    const dummyData = new Array<ScoreboardData>();

    for (let i = 0; i < amount; i++) {
        const rank = i + 1;
        const name = `Company ${i}`;
        const size = sizes[i % 4];
        const count = Math.floor(Math.random() * 10000);
        const users = Math.floor(Math.random() * 100);
        dummyData.push({ rank, name, size, count, users });
    }
    return dummyData;
};

const Scoreboard: React.FunctionComponent = () => {
    // const { data, error } = useSWR('fake', getCompetitionScores);
    const data = generateDummyData(100);
    const error = null;

    return (
        <ScoreboardContainer>
            {data && (
                <Box>
                    <BootStrapTable
                        keyField="name"
                        data={data}
                        columns={columns}
                        striped
                        hover
                        bordered={false}
                        expandRow={expandRows}
                        pagination={paginationFactory()}
                    />
                </Box>
            )}
            {error && <p>An error occurred.</p>}
            {!data && !error && <Loader />}
        </ScoreboardContainer>
    );
};

export default Scoreboard;
