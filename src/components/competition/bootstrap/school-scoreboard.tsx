import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import BootStrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import styled from 'styled-components';
import { ScoreboardData } from '../../../types/competition';
import Loader from '../../ui/animated/loader';
import paginationFactory, {
    PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
// import * as colors from '../ui/colors';
import { schoolSizeFormatter } from '../../../utilities/competition-helper';
import { theme } from '../../../styles/global';

const Box = styled.div`
    box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 1px;
    border: 1px solid #dee2e6;
    border-top: none;
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

    & .table {
        margin-bottom: 0rem;
    }
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
    backgroundColor: theme.colors.darkerBlue,
    color: 'white',
    borderTop: 'none',
    fontFamily: theme.fonts.title,
    fontSize: '1.2rem',
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
        text: 'Skóli',
        sort: true,
        headerStyle: () => {
            return {
                width: '35%',
                ...HeaderStyle,
            };
        },
        align: 'left',
        headerAlign: 'left',
        filter: textFilter({ placeholder: 'Finndu skóla...' }),

        // headerFormatter: HeaderFormatter,
    },
    {
        dataField: 'size',
        text: 'Flokkur',
        sort: true,
        hidden: false,
        headerAlign: 'right',
        align: 'right',
        headerStyle: HeaderStyle,
        formatter: schoolSizeFormatter,
    },
    {
        dataField: 'users',
        text: 'Keppendur',
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
        text: 'Skóli',
        sort: true,
        headerStyle: () => {
            return {
                width: '60%',
                ...HeaderStyle,
            };
        },
        align: 'left',
        headerAlign: 'left',
        filter: textFilter({ placeholder: 'Finndu skóla...' }),

        // headerFormatter: HeaderFormatter,
    },
    {
        dataField: 'size',
        text: 'Flokkur',
        sort: true,
        hidden: true,
        headerAlign: 'right',
        align: 'right',
        headerStyle: HeaderStyle,
        formatter: schoolSizeFormatter,
    },
    {
        dataField: 'users',
        text: 'Keppendur',
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
            <p>{`Skólinn er i flokki ${schoolSizeFormatter(
                null,
                row
            )} og hefur hingað til ${row.users} mismunandi keppendur.`}</p>
        </div>
    ),
};

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

// const data = generateDummyData(100);

const sizesPerPage = [25, 50, 100];

const PagesContainer = styled.div``;

interface Props {
    pre?: boolean;
    blue?: boolean;
    data?: ScoreboardData[];
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
    const [sizePerPage, setSizePerPage] = useState(25);
    const data = props.data;
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
            sizePerPage: 25,
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
                                    <SelectContainer>
                                        Fjöldi á síðu:{' '}
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
                        </ScoreboardContainer>
                    )}
                </PaginationProvider>
            ) : (
                <div>
                    <Loader />
                </div>
            )}
        </div>
    );
};

ScoreboardWithCustomPagination.defaultProps = {
    pre: false,
};

export default ScoreboardWithCustomPagination;
