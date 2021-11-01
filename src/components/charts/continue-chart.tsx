import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { TimelineStat } from '../../types/stats';
import { ContributeType } from '../../types/contribute';
import { useTranslation } from '../../server/i18n';

moment.locale('is');

interface ContinueChartProps {
    contributeType: string;
    count: number;
}

type Props = ReturnType<typeof mapStateToProps> & ContinueChartProps;

export const ContinueChart: React.FunctionComponent<Props> = ({
    contributeType,
    count,
    stats,
}) => {
    const { t } = useTranslation('charts');

    const getData = (contributeType: string): TimelineStat[] => {
        switch (contributeType) {
            case ContributeType.SPEAK:
                return stats.clips;
            case ContributeType.LISTEN:
                return stats.votes;
            case ContributeType.REPEAT:
                return stats.repeatClips;
            default:
                return [];
        }
    };

    const dateFormatter = (item: any) => {
        const today = moment().diff(item, 'days');
        if (today == 0) {
            return t('today');
        } else if (today == 5 || today == 3) {
            return '';
        } else {
            if (today == 6) {
                return t('week-ago');
            }
            return '';
        }
    };

    const data = getData(contributeType);

    const chartData = () => ({
        labels: data.map((stat: TimelineStat) => dateFormatter(stat.date)),
        datasets: [
            {
                label: '',
                backgroundColor: [
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(96,193,151,1)',
                ],
                hoverBackgroundColor: [
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(0,153,255,1)',
                    'rgba(96,193,151,1)',
                ],
                borderWidth: 0,
                data: data.map((stat: TimelineStat, index: number) =>
                    index == data.length - 1 ? stat.count + count : stat.count
                ),
            },
        ],
    });

    return (
        <Bar
            data={chartData()}
            options={{
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: true,
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: true,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            }}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    stats: state.stats.weekly,
});

export default connect(mapStateToProps)(ContinueChart);
