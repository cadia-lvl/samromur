import { WithTranslation } from 'next-i18next';
import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { withTranslation } from '../../../server/i18n';
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
                // Need to manually enter all languages here until a workaround is found
                return (
                    !item.text.match('Staðfest') && !item.text.match('Reviewed')
                );
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

interface AgeGenderChartProps {
    inputData?: any;
}

type Props = AgeGenderChartProps & WithTranslation;

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
        const { t } = this.props;

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
                    label: t('reviewed'),
                    data: kona_valid,
                    backgroundColor: '#59cbb7',
                    stack: 1,
                    minBarLength: 3,
                },
                {
                    label: t('women'),
                    data: kona,
                    backgroundColor: '#ff4f5e',
                    stack: 1,
                    minBarLength: 3,
                },
                {
                    label: t('reviewed'),
                    data: karl_valid,
                    backgroundColor: '#59cbb7',
                    stack: 2,
                    minBarLength: 3,
                },
                {
                    label: t('man'),
                    data: karl,
                    backgroundColor: '#629ff4',
                    stack: 2,
                    minBarLength: 3,
                },
                {
                    label: t('reviewed'),
                    data: total_valid,
                    backgroundColor: '#59cbb7',
                    stack: 3,
                    minBarLength: 3,
                },
                {
                    label: t('total'),
                    data: total,
                    backgroundColor: '#2b376c',
                    stack: 3,
                    minBarLength: 3,
                },
                {
                    label: t('of-which-reviewed'),
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
        const { t } = this.props;
        return (
            <div>
                <ChartTitle>{t('age-gender-chart-title')}</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default withTranslation('database')(AgeGenderChart);
