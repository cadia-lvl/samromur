import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchAgeGenderStats } from '../../../services/stats-api';

const options = {
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
    },
};

interface Props {}

interface State {
    data: any;
}

class AgeGenderChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: [] };
    }

    componentDidMount = async () => {
        const ageGenderStats = await fetchAgeGenderStats();
        const data = this.generateDataSet(ageGenderStats);
        console.log(ageGenderStats);
        console.table(ageGenderStats);
        this.setState({ data });
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
            labels.push(row.age);
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
                    data: karl_valid,
                    backgroundColor: '#59cbb7',
                    stack: 1,
                    legend: { display: false },
                },
                {
                    label: 'Karl',
                    data: karl,
                    backgroundColor: '#629ff4',
                    stack: 1,
                },
                {
                    label: 'Staðfest',
                    data: kona_valid,
                    backgroundColor: '#59cbb7',
                    stack: 2,
                },
                {
                    label: 'Kona',
                    data: kona,
                    backgroundColor: '#ff4f5e',
                    stack: 2,
                },
                {
                    label: 'Þar af staðfest',
                    data: total_valid,
                    backgroundColor: '#59cbb7',
                    stack: 3,
                },
                {
                    label: 'Total',
                    data: total,
                    backgroundColor: '#2b376c',
                    stack: 3,
                },
            ],
        };

        return dataSet;
    };

    render() {
        const { data } = this.state;
        console.table(data);

        return (
            <div>
                This will be a nice chart
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default AgeGenderChart;
