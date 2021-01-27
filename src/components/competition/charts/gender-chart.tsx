import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { competitionGenderStats } from './gender';

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

class CompetitionGenderChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: { labels: [], datasets: [] } };
    }

    componentDidMount = async () => {
        const genderStats = competitionGenderStats;
        const data = this.generateDataSet(genderStats);
        this.setState({ data });
    };

    generateDataSet = (data: any) => {
        const labels: any = [];
        const karl: any[] = [data[1].count];
        const kona: any[] = [data[0].count];
        const annat: any[] = [data[2].count];

        data.forEach((row: any) => {
            labels.push(row.sex);
        });

        const dataSet = {
            labels: [''],
            datasets: [
                {
                    label: 'Kona',
                    data: kona,
                    backgroundColor: '#ff4f5e',
                },
                {
                    label: 'Karl',
                    data: karl,
                    backgroundColor: '#629ff4',
                },
                {
                    label: 'Annað',
                    data: annat,
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
                <ChartTitle>Uppökur eftir kyni</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default CompetitionGenderChart;
