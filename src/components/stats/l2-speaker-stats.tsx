import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import useSWR from 'swr';
import { getL2SpeakersStats } from '../../services/stats-api';
import { theme } from '../../styles/global';

interface L2SpeakerData {
    total: number;
    valid: number;
    invalid: number;
}

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
    legend: { display: false },
};

const L2SpeakerStats: React.FunctionComponent = () => {
    const { data, error } = useSWR('l2speaker', getL2SpeakersStats);

    const generateChart = () => {
        const barChartData = generateBarChartData(data);
        return <Bar data={barChartData} options={options} />;
    };
    const generateBarChartData = (indata: L2SpeakerData) => {
        const labels = ['Total (uttr)', 'Valid (uttr)', 'Invalid (uttr)'];
        const barData = [indata.total, indata.valid, indata.invalid];
        console.log(indata);

        const barChartData = {
            labels: labels,
            datasets: [
                {
                    data: barData,
                    backgroundColor: [
                        theme.colors.blue,
                        theme.colors.green,
                        theme.colors.red,
                    ],
                },
            ],
        };

        return barChartData;
    };

    return (
        <div>
            <h3>L2 Speaker Stats</h3>
            {error && <p>Failed to load data.</p>}
            {!data && <p>Loading...</p>}
            {data && generateChart()}
        </div>
    );
};

export default L2SpeakerStats;
