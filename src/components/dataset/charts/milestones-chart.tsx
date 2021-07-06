import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from '../../../server/i18n';
import { fetchMileStoneGroups } from '../../../services/stats-api';
import { options } from './age-gender-chart';

const ChartTitle = styled.h5``;

type Props = WithTranslation;
interface State {
    data: any;
}

class MilestoneChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: { labels: [], datasets: [] } };
    }

    componentDidMount = async () => {
        //TODO: make the calls ssr, move to gagnasafn page
        const milestoneStats = await fetchMileStoneGroups();
        const data = this.generateDataSet(milestoneStats);
        this.setState({ data });
    };

    getTextFromLabel = (label: string) => {
        const { t } = this.props;
        switch (label) {
            case 'adult':
                return t('adults-icelandic');
            case 'l2_adult':
                return t('adults-l2');
            case 'l2_child':
                return t('kids-l2');
            default:
                return t('kids-icelandic');
        }
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
                    label: t('reviewed'),
                    data: kona_valid,
                    backgroundColor: '#59cbb7',
                    stack: 1,
                },
                {
                    label: t('women'),
                    data: kona,
                    backgroundColor: '#ff4f5e',
                    stack: 1,
                },
                {
                    label: t('reviewed'),
                    data: karl_valid,
                    backgroundColor: '#59cbb7',
                    stack: 2,
                },
                {
                    label: t('man'),
                    data: karl,
                    backgroundColor: '#629ff4',
                    stack: 2,
                },
                {
                    label: t('reviewed'),
                    data: total_valid,
                    backgroundColor: '#59cbb7',
                    stack: 3,
                },
                {
                    label: t('total'),
                    data: total,
                    backgroundColor: '#2b376c',
                    stack: 3,
                },
                {
                    label: t('of-which-reviewed'),
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
        const { t } = this.props;
        return (
            <div>
                <ChartTitle>{t('age-mother-tounge-chart-title')}</ChartTitle>
                <Bar data={data} options={options} />
            </div>
        );
    }
}

export default withTranslation('database')(MilestoneChart);
