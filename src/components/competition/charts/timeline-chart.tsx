import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { theme } from '../../../styles/global';
import { competitionTimeline } from './timeline';

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

interface Props {
    chartData: any;
}

interface State {
    data: any;
}

class CompetitionTimeLineChart extends React.Component<Props, State> {
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
            labels.push(row.date);
            count.push(row.count);
        });

        const dataSet = {
            labels: labels,
            datasets: [
                {
                    label: 'Upptökur',
                    data: count,
                    backgroundColor: theme.colors.blue,
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
                <ChartTitle>Upptökur per dag</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default CompetitionTimeLineChart;
