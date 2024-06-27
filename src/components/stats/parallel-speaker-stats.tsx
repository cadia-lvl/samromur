import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import useSWR from 'swr';
import { getParallelSpeakersStats } from '../../services/stats-api';
import { theme } from '../../styles/global';

interface ParallelSpeakerData {
    total: number;
    valid: number;
    invalid: number;
}

const options = {
    scales: {
        yAxes: [
            {
                stacked: false,
                ticks: {
                    beginAtZero: true,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'utt',
                },
            },
        ],
    },
    legend: { display: false },
};

const ParallelSpeakerStats: React.FunctionComponent = () => {
    const { data, error } = useSWR('parallelspeaker', getParallelSpeakersStats);

    const generateChart = () => {
        const barChartData = generateBarChartData(data);
        return <Bar data={barChartData} options={options} />;
    };
    const generateBarChartData = (indata: ParallelSpeakerData) => {
        const labels = ['Total (utt)', 'Valid (utt)', 'Invalid (utt)'];
        const barData = [indata.total, indata.valid, indata.invalid];
        const goal = [50000, 0, 0];

        const barChartData = {
            labels: labels,
            datasets: [
                {
                    data: goal,
                    label: 'Goal',
                    stack: 1,
                },
                {
                    data: barData,
                    label: 'data',
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
            <h3>Parallel Speaker Stats</h3>
            {error && <p>Failed to load data.</p>}
            {!error && !data && <p>Loading...</p>}
            {data && generateChart()}
        </div>
    );
};

export default ParallelSpeakerStats;
