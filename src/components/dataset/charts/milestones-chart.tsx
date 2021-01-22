import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { fetchMileStoneGroups } from '../../../services/stats-api';
import { options } from './age-gender-chart';

const ChartTitle = styled.h5``;

interface Props {}

interface State {
    data: any;
}

class MilestoneChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: { labels: [], datasets: [] } };
    }

    componentDidMount = async () => {
        const milestoneStats = await fetchMileStoneGroups();
        const data = this.generateDataSet(milestoneStats);
        this.setState({ data });
    };

    getTextFromLabel = (label: string) => {
        switch (label) {
            case 'adult':
                return 'Fullorðnir, íslenska móðurmál';
            case 'adult_l2':
                return 'Fullorðnir, annað móðurmál';
            default:
                return 'Börn og unglingar';
        }
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
            labels.push(this.getTextFromLabel(row.hopur as string));
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
                },
                {
                    label: 'Kona',
                    data: kona,
                    backgroundColor: '#ff4f5e',
                    stack: 1,
                },
                {
                    label: 'Staðfest',
                    data: karl_valid,
                    backgroundColor: '#59cbb7',
                    stack: 2,
                },
                {
                    label: 'Karl',
                    data: karl,
                    backgroundColor: '#629ff4',
                    stack: 2,
                },
                {
                    label: 'Staðfest',
                    data: total_valid,
                    backgroundColor: '#59cbb7',
                    stack: 3,
                },
                {
                    label: 'Samtals',
                    data: total,
                    backgroundColor: '#2b376c',
                    stack: 3,
                },
                {
                    label: 'Þar af staðfest',
                    data: [],
                    backgroundColor: '#59cbb7',
                    stack: 3,
                },
            ],
        };

        return dataSet;
    };

    render() {
        const { data } = this.state;
        return (
            <div>
                <ChartTitle>Uppökur efter aldri og móðurmáli</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default MilestoneChart;
