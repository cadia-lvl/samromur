import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';
import { competitionGenderStats } from './gender';

const ChartTitle = styled.h5``;

export const options = {
    scales: {
        yAxes: [
            {
                display: false,
            },
        ],
        xAxes: [
            {
                display: false,
            },
        ],
    },
    legend: {
        labels: {
            filter: function (item: any, chart: any) {
                // Logic to remove a particular legend item goes here
                return !item.text.match('HIDELABEL');
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

class CompetitionGenderChart extends React.Component<Props, State> {
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
            labels.push(this.fixLabel(row.gender));
            count.push(row.count);
        });

        const dataSet = {
            labels: labels,
            datasets: [
                {
                    label: 'HIDELABEL',
                    data: count,
                    backgroundColor: ['#ff4f5e', '#629ff4', '#2b376c'],
                },
            ],
        };

        return dataSet;
    };

    fixLabel = (label: string): string => {
        switch (label) {
            case 'karl':
                return 'Karl';
                break;
            case 'kona':
                return 'Kona';
                break;
            case 'annad':
                return 'Annað';
                break;
            default:
                return label;
                break;
        }
    };

    render() {
        const { data } = this.state;
        return (
            <div>
                <ChartTitle>Upptökur eftir kyni</ChartTitle>
                <Pie data={data} options={options} />
            </div>
        );
    }
}

export default CompetitionGenderChart;
