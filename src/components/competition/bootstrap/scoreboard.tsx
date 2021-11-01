import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import BootStrapTable, {
    BootstrapTableProps,
    PaginationOptions,
} from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import styled from 'styled-components';
import useSWR from 'swr';
import {
    getCompetitionScores,
    getPreCompetitionScores,
} from '../../../services/competition-api';
import { ScoreboardData } from '../../../types/competition';
import Loader from '../../ui/animated/loader';
import paginationFactory, {
    PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

const Box = styled.div`
    box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 1px;
    border: 1px solid #dee2e6;
    overflow: overlay;
    height: auto;
    width: auto;
    margin-bottom: 1rem;
`;

const ScoreboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 50rem;
    margin: 0 auto;
`;

const StyledSelect = styled.select`
    box-shadow: rgb(0 0 0 / 25%) 0px 0px 3px 1px;
    border: 1px solid rgb(249, 249, 249);
    background-color: white;
`;

const TableTitle = styled.h1``;

const TableButton = styled.button`
    background-color: white;
    box-shadow: rgb(0 0 0 / 25%) 0px 0px 3px 1px;
    border: 1px solid rgb(249, 249, 249);
    border-radius: 100%;
    padding: 0 0.75rem;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.warmGray};
    margin-left: 0.5rem;

    & :hover {
        background-color: #97979716;
    }
`;

const topThreeFormatter = (cell: any, row: ScoreboardData) => {
    if (row.rank == 1) {
        return <span> 🥇 </span>;
    }
    if (row.rank == 2) {
        return <span> 🥈 </span>;
    }
    if (row.rank == 3) {
        return <span> 🥉 </span>;
    }
    return <span>{cell}</span>;
};

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
`;

// const HeaderFormatter = (column, colIndex, { sortElement, filterElement }) => {
//     return (
//         <Header>
//             {column.text}
//             {sortElement}
//             {filterElement}
//         </Header>
//     );
// };

const columns = [
    {
        dataField: 'rank',
        text: '# Staða',
        sort: true,
        // headerStyle: () => {
        //     return { width: '10%' };
        // },
        headerAlign: 'left',
        align: 'center',
        formatter: topThreeFormatter,
        // headerFormatter: HeaderFormatter,
    },
    {
        dataField: 'name',
        text: 'Vinnustaður',
        sort: true,
        headerStyle: () => {
            return { width: '50%' };
        },
        align: 'center',
        headerAlign: 'center',
        filter: textFilter(),
        // headerFormatter: HeaderFormatter,
    },
    {
        dataField: 'size',
        text: 'Company size',
        sort: true,
        hidden: true,
    },
    {
        dataField: 'users',
        text: 'Notendur',
        sort: true,
        hidden: false,
        headerAlign: 'right',
        align: 'right',
    },
    {
        dataField: 'count',
        text: 'Setningar',
        sort: true,
        align: 'right',
        headerAlign: 'right',
        // headerStyle: () => {
        //     return { width: '20%' };
        // },
    },
];

const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SizePerPageContainer = styled.div``;

const PageSelectorContainer = styled.div``;

const SizePerPageListItem = styled.li`
    width: 100%;
    clear: both;
    display: block;
    transition-duration: 0.5s;

    & :hover {
        cursor: pointer;
        background-color: #c2c2c23d;
    }
`;

const SizePerPageDropdownButton = styled.button`
    border: 2px solid lightgray;
    padding: 0.25rem;
    visibility: visible;
    cursor: pointer;
`;

const SizePerPageDropdown = styled.div`
    position: relative;
    display: inline-block;
`;

const SizePerPageDropdownList = styled.ul`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    transition: all 0.5s ease;
    left: 0;
    display: none;
    background-color: white;
    width: 100%;
    box-shadow: 0 0 3px 2px rgb(0 0 0 / 8%);

    /* ${SizePerPageDropdown} :hover & {
        visibility: visible;
        display: block;
        opacity: 1;
    } */

    ${SizePerPageDropdownButton} :hover & {
        visibility: visible;
        display: block;
        opacity: 1;
    }
`;

const SizePerPageButton = styled.div``;

const expandRows = {
    renderer: (row: ScoreboardData) => (
        <div>
            <p>{`${row.name} has contributed with an amazing ${row.count} utterances.`}</p>
            <p>{`The company/team is of ${row.size} size and has so far ${row.users} individual contributors`}</p>
        </div>
    ),
};

// const pageListRenderer = ({ pages, onPageChange }) => {
//     const pageWithoutIndication = pages.filter(
//         (p) => typeof p.page == 'string'
//     );
//     console.log(pages);
//     return (
//         <div>
//             {pageWithoutIndication.map((p) => (
//                 <button onClick={() => onPageChange(p.page)}>{p.page}</button>
//             ))}
//         </div>
//     );
// };

const options = {
    custom: true,
    totalSize: 100,
    // hideSizePerPage: true,
    // withFirstAndLast: false,
    // paginationSize: 3,
    // hidePageListOnlyOnePage: true,
    // totalSize: 100,
    // alwaysShowAllBtns: true,
    // pageListRenderer: pageListRenderer,
};

const defaultData = new Array<ScoreboardData>();

const dummyData: ScoreboardData[] = [
    { rank: 1, name: 'Company X', size: 'medium', count: 1, users: 100 },
];

const sizes = ['small', 'medium', 'large'];

const generateDummyData = (amount: number): ScoreboardData[] => {
    const dummyData = new Array<ScoreboardData>();

    for (let i = 0; i < amount; i++) {
        const rank = i + 1;
        const name = `Company ${i}`;
        const size = sizes[i % 4];
        const count = 10000 - i * 100 - Math.floor(Math.random() * 100);
        const users = Math.floor(Math.random() * 100);
        dummyData.push({ rank, name, size, count, users });
    }
    return dummyData;
};

// const Scoreboard: React.FunctionComponent = () => {
//     // const { data, error } = useSWR('fake', getCompetitionScores);
//     const data = generateDummyData(100);
//     const error = null;

//     return (
//         <ScoreboardContainer>
//             {data && (
//                 <>
//                     <TableTitle>Stigatafla</TableTitle>
//                     <Box>
//                         <BootStrapTable
//                             keyField="name"
//                             data={data}
//                             columns={columns}
//                             bootstrap4
//                             striped
//                             hover
//                             // bordered={false}
//                             expandRow={expandRows}
//                             pagination={paginationFactory(options)}
//                         />
//                     </Box>
//                 </>
//             )}
//             {error && <p>An error occurred.</p>}
//             {!data && !error && <Loader />}
//         </ScoreboardContainer>
//     );
// };

// const data = generateDummyData(100);

const sizesPerPage = [10, 25, 50, 100];

const PagesContainer = styled.div``;

interface Props {
    pre?: boolean;
}

const ScoreboardWithCustomPagination: React.FunctionComponent<Props> = (
    props: Props
) => {
    const [sizePerPage, setSizePerPage] = useState(10);
    const { data, error } = useSWR(
        'competition-scores',
        props.pre ? getPreCompetitionScores : getCompetitionScores
    );

    const handleNextPage = (paginationProps: any) => () => {
        const {
            page,
            onPageChange,
            totalSize,
            sizePerPage,
            dataSize,
        } = paginationProps;
        if (page * sizePerPage >= totalSize) return;
        if (page * sizePerPage >= dataSize) return;
        onPageChange(page + 1);
    };

    const handlePrevPage = ({ page, onPageChange }: any) => () => {
        if (page == 1) return;
        onPageChange(page - 1);
    };

    const handleSizePerPage = async (
        { page, onSizePerPageChange, onPageChange }: any,
        newSizePerPage: number
    ) => {
        await onPageChange(1);
        onSizePerPageChange(newSizePerPage, 1);
    };

    const onSizePerPageChange = (
        paginationProps: any,
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        const newSizePerPage = parseInt(e.target.value);
        handleSizePerPage(paginationProps, newSizePerPage);
        setSizePerPage(newSizePerPage);
    };

    const getOptions = () => {
        const o = {
            custom: true,
            totalSize: data ? data.length : 0,
        };
        return o;
    };

    return (
        <div>
            {data && (
                <PaginationProvider
                    pagination={paginationFactory(getOptions())}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ScoreboardContainer>
                            <Box>
                                <BootStrapTable
                                    bootstrap4
                                    striped
                                    expandRow={expandRows}
                                    hover
                                    bordered={false}
                                    {...paginationTableProps}
                                    keyField="name"
                                    data={data}
                                    columns={columns}
                                    filter={filterFactory()}
                                />
                            </Box>
                            <PaginationContainer>
                                <SizePerPageContainer>
                                    {/* <SizePerPageDropdown>
                                    <SizePerPageDropdownButton>
                                        Size per page:{' '}
                                        {paginationProps.sizePerPage}
                                    </SizePerPageDropdownButton> */}
                                    {/* <SizePerPageDropdownList>
                                        <SizePerPageListItem>
                                            <SizePerPageButton
                                                onClick={() =>
                                                    handleSizePerPage(
                                                        paginationProps,
                                                        10
                                                    )
                                                }
                                            >
                                                10
                                            </SizePerPageButton>
                                        </SizePerPageListItem>
                                        <SizePerPageListItem>
                                            <SizePerPageButton
                                                onClick={() =>
                                                    handleSizePerPage(
                                                        paginationProps,
                                                        25
                                                    )
                                                }
                                            >
                                                25
                                            </SizePerPageButton>
                                        </SizePerPageListItem>
                                    </SizePerPageDropdownList>
                                </SizePerPageDropdown> */}
                                    <div>
                                        Magn á síðu:{' '}
                                        <StyledSelect
                                            onChange={(e) =>
                                                onSizePerPageChange(
                                                    paginationProps,
                                                    e
                                                )
                                            }
                                            value={sizePerPage}
                                        >
                                            {sizesPerPage.map((e) => {
                                                return (
                                                    <option value={e} key={e}>
                                                        {e}
                                                    </option>
                                                );
                                            })}
                                        </StyledSelect>
                                    </div>
                                </SizePerPageContainer>
                                <PageSelectorContainer>
                                    {' '}
                                    <div>
                                        <TableButton
                                            onClick={handlePrevPage(
                                                paginationProps
                                            )}
                                        >
                                            {'<'}
                                        </TableButton>
                                        <TableButton
                                            onClick={handleNextPage(
                                                paginationProps
                                            )}
                                        >
                                            {'>'}
                                        </TableButton>
                                    </div>
                                </PageSelectorContainer>
                            </PaginationContainer>
                            {/* <div>
                            <p>Current Page: {paginationProps.page}</p>
                            <p>
                                Current SizePerPage:{' '}
                                {paginationProps.sizePerPage}
                            </p>
                        </div> */}
                        </ScoreboardContainer>
                    )}
                </PaginationProvider>
            )}
            {/* <Code>{sourceCode}</Code> */}
        </div>
    );
};

ScoreboardWithCustomPagination.defaultProps = {
    pre: false,
};

export default ScoreboardWithCustomPagination;
