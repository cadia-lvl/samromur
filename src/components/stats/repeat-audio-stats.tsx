import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import useSWR from 'swr';
import { getRepeatAudioStats } from '../../services/stats-api';
import { theme } from '../../styles/global';

interface RepeatAudioStats {
    agegroup: string;
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
                    labelString: 'uttr',
                },
            },
        ],
    },
    legend: { display: false },
};

const RepeatAudioStats: React.FunctionComponent = () => {
    const { data, error } = useSWR('repeat', getRepeatAudioStats);

    const generateChart = () => {
        const barChartData = generateBarChartData(data);
        return <Bar data={barChartData} options={options} />;
    };

    const generateBarChartData = (indata: RepeatAudioStats[]) => {
        const labels: string[] = [
            'Total (uttr)',
            'Valid (uttr)',
            'Invalid (uttr)',
        ];
        const adults: number[] = [];
        const children: number[] = [];

        indata.forEach((e) => {
            if (e.agegroup == 'adults') {
                adults.push(e.total);
                adults.push(e.valid);
                adults.push(e.invalid);
            }
            if (e.agegroup == 'children') {
                children.push(e.total);
                children.push(e.valid);
                children.push(e.invalid);
            }
        });

        const goal = [0, 30000, 0];

        console.log(adults);

        const dataSet = {
            labels: labels,
            datasets: [
                {
                    label: 'Goal Adults',
                    data: goal,
                    stack: 1,
                },
                {
                    label: 'Goal Children',
                    data: goal,
                    stack: 2,
                },
                {
                    label: 'adults',
                    data: adults,
                    backgroundColor: [
                        theme.colors.darkerBlue,
                        theme.colors.darkerGreen,
                        theme.colors.darkerRed,
                    ],
                    stack: 1,
                },
                {
                    label: 'children',
                    data: children,
                    backgroundColor: [
                        theme.colors.blue,
                        theme.colors.green,
                        theme.colors.red,
                    ],
                    stack: 2,
                },
            ],
        };
        return dataSet;
    };

    return (
        <div>
            <h3>Repeat Audio Stats</h3>
            {error && <p>Failed to load data.</p>}
            {!data && <p>Loading...</p>}
            {data && generateChart()}
        </div>
    );
};

export default RepeatAudioStats;
