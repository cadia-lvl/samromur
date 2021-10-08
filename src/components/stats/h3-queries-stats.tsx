import * as React from 'react';
import useSWR from 'swr';
import { getH3QueriesStats } from '../../services/stats-api';
import { Bar } from 'react-chartjs-2';
import { theme } from '../../styles/global';

interface H3Data {
    is_valid: number | null;
    amount: number;
    hours: number;
}

const defaultH3Data: H3Data = {
    is_valid: null,
    amount: 0,
    hours: 0,
};

const options = {
    scales: {
        yAxes: [
            {
                stacked: false,
                scaleLabel: {
                    display: true,
                    labelString: 'hrs',
                },
            },
        ],
    },
    legend: { display: false },
};

const H3QueriesStats: React.FunctionComponent = () => {
    const { data, error } = useSWR('queries', getH3QueriesStats);

    const generateChart = () => {
        const barChartData = prepareBarChart(data as H3Data[]);
        return <Bar data={barChartData} options={options} />;
    };

    const prepareBarChart = (indata: H3Data[]) => {
        const total = indata.find((e) => e.is_valid == null) || defaultH3Data;
        const valid = indata.find((e) => e.is_valid == 1) || defaultH3Data;
        const invalid = indata.find((e) => e.is_valid == 0) || defaultH3Data;

        const hours: number[] = [total.hours, valid.hours, invalid.hours];
        const labels: string[] = [
            'Total (hrs)',
            'Valid (hrs)',
            'Invalid (hrs)',
        ];
        const goalData: number[] = [0, 20, 0];
        const barChartData = {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Goal',
                    fill: false,
                    data: goalData,
                    stack: 1,
                },
                {
                    type: 'bar',
                    label: 'data',
                    data: hours,
                    backgroundColor: [
                        theme.colors.blue,
                        theme.colors.green,
                        theme.colors.red,
                    ],
                    stack: 1,
                },
            ],
        };

        return barChartData;
    };

    return (
        <div>
            <h3>H3 Queries stats</h3>
            {error && <p>Failed to load data.</p>}
            {!error && !data && <p>Loading...</p>}
            {data && generateChart()}
        </div>
    );
};

export default H3QueriesStats;
