import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import BootStrapTable, {
    BootstrapTableProps,
    PaginationOptions,
} from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import styled, { withTheme } from 'styled-components';
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
import * as colors from '../ui/colors';
import { sizeFormatter } from '../../../utilities/competition-helper';

const Box = styled.div`
    box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 1px;
    border: 1px solid #dee2e6;
    overflow: overlay;
    height: auto;
    width: auto;
    margin-bottom: 1rem;
    background-color: white;
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

const HeaderStyle = {
    backgroundColor: colors.siminn,
    color: 'white',
};

// headerStyle: () => {
//     return { width: '10%' };
// },
const columns = [
    {
        dataField: 'rank',
        text: '*',
        sort: true,
        headerAlign: 'left',
        align: 'left',
        formatter: topThreeFormatter,
        headerStyle: () => {
            return {
                width: '10%',
                ...HeaderStyle,
            };
        },
    },
    {
        dataField: 'name',
        text: 'Vinnustaður',
        sort: true,
        headerStyle: () => {
            return {
                width: '35%',
                ...HeaderStyle,
            };
        },
        align: 'left',
        headerAlign: 'left',
        filter: textFilter(),

        // headerFormatter: HeaderFormatter,
    },
    {
        dataField: 'size',
        text: 'Fjöldi starfsmanna',
        sort: true,
        hidden: false,
        headerStyle: HeaderStyle,
        formatter: sizeFormatter,
    },
    {
        dataField: 'users',
        text: 'Notendur',
        sort: true,
        hidden: false,
        headerAlign: 'right',
        align: 'right',
        headerStyle: HeaderStyle,
    },
    {
        dataField: 'count',
        text: 'Setningar',
        sort: true,
        align: 'right',
        headerAlign: 'right',
        headerStyle: HeaderStyle,

        // headerStyle: () => {
        //     return { width: '20%' };
        // },
    },
];

const columnsMobile = [
    {
        dataField: 'rank',
        text: '*',
        sort: true,
        headerAlign: 'left',
        align: 'center',
        formatter: topThreeFormatter,
        headerStyle: () => {
            return {
                width: '10%',
                ...HeaderStyle,
            };
        },
    },
    {
        dataField: 'name',
        text: 'Vinnustaður',
        sort: true,
        headerStyle: () => {
            return {
                width: '60%',
                ...HeaderStyle,
            };
        },
        align: 'left',
        headerAlign: 'left',
        filter: textFilter(),

        // headerFormatter: HeaderFormatter,
    },
    {
        dataField: 'size',
        text: 'Fjöldi starfsmanna',
        sort: true,
        hidden: true,
        headerStyle: HeaderStyle,
        formatter: sizeFormatter,
    },
    {
        dataField: 'users',
        text: 'Notendur',
        sort: true,
        hidden: true,
        headerAlign: 'right',
        align: 'right',
        headerStyle: HeaderStyle,
    },
    {
        dataField: 'count',
        text: 'Setningar',
        sort: true,
        align: 'right',
        headerAlign: 'right',
        headerStyle: HeaderStyle,

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

interface SelectContainerProps {
    white?: boolean;
}

const SelectContainer = styled.div<SelectContainerProps>`
    color: ${(props) => (props.white ? 'white' : 'black')};
`;

const SizePerPageButton = styled.div``;

const expandRows = {
    renderer: (row: ScoreboardData) => (
        <div>
            <p>{`${row.name} hefur lagt sitt af mörkum með ${row.count} setningum.`}</p>
            <p>{`Vinnustaðurinn er með ${sizeFormatter(
                null,
                row
            ).toLocaleLowerCase()} starfsmenn og hefur hingað til ${
                row.users
            } mismunandi notendur.`}</p>
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
    blue?: boolean;
}

// Custom hook to detect size of the window
const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
};

const ScoreboardWithCustomPagination: React.FunctionComponent<Props> = (
    props: Props
) => {
    const [sizePerPage, setSizePerPage] = useState(10);
    const { data, error } = useSWR(
        'competition-scores',
        props.pre ? getPreCompetitionScores : getCompetitionScores
    );
    const [width, height] = useWindowSize();

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
            {data ? (
                <PaginationProvider
                    pagination={paginationFactory(getOptions())}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ScoreboardContainer>
                            <Box>
                                {width > 768 ? (
                                    <BootStrapTable
                                        wrapperClasses="boo"
                                        bootstrap4
                                        striped
                                        hover
                                        bordered={false}
                                        {...paginationTableProps}
                                        keyField="name"
                                        data={data}
                                        columns={columns}
                                        filter={filterFactory()}
                                        key="desktop"
                                    />
                                ) : (
                                    <BootStrapTable
                                        wrapperClasses=""
                                        bootstrap4
                                        striped
                                        expandRow={expandRows}
                                        hover
                                        bordered={false}
                                        {...paginationTableProps}
                                        keyField="name"
                                        data={data}
                                        columns={columnsMobile}
                                        filter={filterFactory()}
                                        key="mobile"
                                    />
                                )}
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
                                    <SelectContainer white={props.blue}>
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
                                    </SelectContainer>
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
            ) : (
                <Loader />
            )}
            {/* <Code>{sourceCode}</Code> */}
        </div>
    );
};

ScoreboardWithCustomPagination.defaultProps = {
    pre: false,
};

export default ScoreboardWithCustomPagination;
