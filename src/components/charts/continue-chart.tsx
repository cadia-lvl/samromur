import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { TimelineStat } from '../../types/stats';
import { ContributeType } from '../../types/contribute';

moment.locale('is');

const dateFormatter = (item: any) => {
    const today = moment().diff(item, 'days');
    if (today == 0) {
        return 'í dag';
    } else if (today == 5 || today == 3) {
        return '';
    } else {
        if (today == 6) {
            return 'fyrir viku';
        }
        return '';
    }
};

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
                    enabled: false,
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
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
