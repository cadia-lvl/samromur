import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { theme } from '../../../styles/global';
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
                return !item.text.match('Upptökur');
            },
        },
        onClick: (e: any) => {},
        position: 'bottom',
    },
    responsive: true,
};

const samromurColors = [
    theme.colors.red,
    theme.colors.red,
    theme.colors.red,
    theme.colors.red,
    theme.colors.green,
    theme.colors.green,
    theme.colors.green,
    theme.colors.green,
    theme.colors.blue,
    theme.colors.blue,
    theme.colors.blue,
    theme.colors.blue,
];

interface Props {
    chartData: any;
}

interface State {
    data: any;
}

class CompetitionAgeChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: { labels: [], datasets: [] } };
    }

    componentDidMount = async () => {
        const { chartData } = this.props;
        const data = this.generateDataSet(chartData);
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
                    label: 'Upptökur',
                    data: count,
                    backgroundColor: samromurColors,
                    minBarLength: 3,
                },
            ],
        };

        return dataSet;
    };

    render() {
        const { data } = this.state;
        return (
            <div>
                <ChartTitle>Upptökur eftir aldri</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default CompetitionAgeChart;
