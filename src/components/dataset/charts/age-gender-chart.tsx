import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { fetchAgeGenderStats } from '../../../services/stats-api';

const ChartTitle = styled.h5``;

export const options = {
    scales: {
        yAxes: [
            {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
        xAxes: [
            {
                stacked: true,
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
    tooltips: {
        callbacks: {
            label: function (tooltipItem: any, data: any) {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                let total = 0;
                switch (data.datasets[tooltipItem.datasetIndex].stack) {
                    case 1: {
                        total =
                            data.datasets[0].data[tooltipItem.index] +
                            data.datasets[1].data[tooltipItem.index];
                        break;
                    }
                    case 2: {
                        total =
                            data.datasets[2].data[tooltipItem.index] +
                            data.datasets[3].data[tooltipItem.index];
                        break;
                    }
                    case 3: {
                        total =
                            data.datasets[4].data[tooltipItem.index] +
                            data.datasets[5].data[tooltipItem.index];
                        break;
                    }
                }

                if (label) {
                    label += ': ';
                }
                switch (tooltipItem.datasetIndex) {
                    case 1:
                    case 3:
                    case 5: {
                        label += total;
                        break;
                    }
                    default: {
                        label += tooltipItem.yLabel;
                    }
                }
                return label;
            },
        },
    },
    //maintainAspectRatio: false,
    responsive: true,
};

interface Props {
    inputData?: any;
}

interface State {
    data: any;
}

class AgeGenderChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: { labels: [], datasets: [] } };
    }

    componentDidMount = async () => {
        //TODO: make the calls ssr, move to gagnasafn page
        const ageGenderStats = this.props.inputData
            ? this.props.inputData
            : await fetchAgeGenderStats();
        const data = this.generateDataSet(ageGenderStats);
        this.setState({ data });
    };

    // This handles the specific case of 06-9 ára
    // we need the 0 in the db call to get the output in the
    // right order, then we trim it here to make it look nice
    ageFormatter = (ageGroup: string) => {
        if (ageGroup && ageGroup[0] === '0') {
            return ageGroup.slice(1);
        }
        return ageGroup;
    };

    generateDataSet = (data: any) => {
        const labels: any = [];
        const karl: any[] = [];
        const karl_valid: any[] = [];
        const kona: any[] = [];
        const kona_valid: any[] = [];
        const total: any[] = [];
        const total_valid: any[] = [];

        data.forEach((row: any) => {
            labels.push(this.ageFormatter(row.age));
            karl.push(row.karl);
            karl_valid.push(row.karl_valid);
            kona.push(row.kona);
            kona_valid.push(row.kona_valid);
            total.push(row.total);
            total_valid.push(row.total_valid);
        });

        const dataSet = {
            labels: labels,
            datasets: [
                {
                    label: 'Staðfest',
                    data: kona_valid,
                    backgroundColor: '#59cbb7',
                    stack: 1,
                    minBarLength: 3,
                },
                {
                    label: 'Kona',
                    data: kona,
                    backgroundColor: '#ff4f5e',
                    stack: 1,
                    minBarLength: 3,
                },
                {
                    label: 'Staðfest',
                    data: karl_valid,
                    backgroundColor: '#59cbb7',
                    stack: 2,
                    minBarLength: 3,
                },
                {
                    label: 'Karl',
                    data: karl,
                    backgroundColor: '#629ff4',
                    stack: 2,
                    minBarLength: 3,
                },
                {
                    label: 'Staðfest',
                    data: total_valid,
                    backgroundColor: '#59cbb7',
                    stack: 3,
                    minBarLength: 3,
                },
                {
                    label: 'Samtals',
                    data: total,
                    backgroundColor: '#2b376c',
                    stack: 3,
                    minBarLength: 3,
                },
                {
                    label: 'Þar af staðfest',
                    data: [],
                    backgroundColor: '#59cbb7',
                    stack: 3,
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
                <ChartTitle>Uppökur eftir aldri og kyni</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default AgeGenderChart;
