import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { competitionAgeStats } from './age';

const ChartTitle = styled.h5``;

export const options = {
    scales: {
        yAxes: [
            {
                stacked: false,
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
        xAxes: [
            {
                stacked: false,
            },
        ],
    },
    legend: {
        labels: {
            filter: function (item: any, chart: any) {
                // Logic to remove a particular legend item goes here
                return !item.text.match('Staðfest');
            },
        },
        onClick: (e: any) => {},
        position: 'bottom',
    },
    responsive: true,
};

interface Props {}

interface State {
    data: any;
}

class CompetitionAgeChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: { labels: [], datasets: [] } };
    }

    componentDidMount = async () => {
        const genderStats = competitionAgeStats;
        const data = this.generateDataSet(genderStats);
        this.setState({ data });
    };

    generateDataSet = (data: any) => {
        const labels: any = [];
        const count: any = [];

        data.forEach((row: any) => {
            labels.push(row.age);
            count.push(row.count);
        });

        const dataSet = {
            labels: labels,
            datasets: [
                {
                    label: 'Staðfest',
                    data: count,
                    backgroundColor: '#2b376c',
                },
            ],
        };

        return dataSet;
    };

    render() {
        const { data } = this.state;
        return (
            <div>
                <ChartTitle>Uppökur eftir aldri</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default CompetitionAgeChart;
