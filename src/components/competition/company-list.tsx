import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import styled from 'styled-components';
import useSWR from 'swr';
import { getCompanies } from '../../services/competition-api';
import { ScoreboardData } from '../../types/competition';
import { Institution } from '../../types/institution';
import { sizeFormatter } from '../../utilities/competition-helper';

const CompanyListContainer = styled.div`
    width: 100%;
    max-width: 30rem;
    background-color: white;
`;

const columns = [
    // {
    //     dataField: 'rank',
    //     text: '# Staða',
    //     sort: true,
    //     // headerStyle: () => {
    //     //     return { width: '10%' };
    //     // },
    //     headerAlign: 'left',
    //     align: 'center',
    // },
    {
        dataField: 'name',
        text: 'Vinnustaður',
        sort: true,
        headerStyle: () => {
            return { width: '50%' };
        },
        // align: 'center',
        // headerAlign: 'center',
        // filter: textFilter(),
    },
    {
        dataField: 'size',
        text: 'Fjöldi starfsmanna',
        sort: true,
        hidden: false,
        formatter: sizeFormatter,
    },
];

const TableContainer = styled.div`
    & .table {
        margin-bottom: 0rem;
    }
`;

const CompanyList: React.FC = () => {
    const { error, data } = useSWR('companies', getCompanies);

    const orderData = (dataToOrder: Institution[]): Institution[] => {
        const ordered = dataToOrder.sort((a, b) =>
            a.name.localeCompare(b.name, 'is-IS')
        );
        return ordered;
    };

    return (
        <CompanyListContainer>
            {data && (
                <TableContainer>
                    <BootstrapTable
                        keyField="name"
                        data={orderData(data)}
                        columns={columns}
                        bootstrap4
                        striped
                    />
                </TableContainer>
            )}
        </CompanyListContainer>
    );
};

export default CompanyList;
