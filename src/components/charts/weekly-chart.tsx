import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { TimelineStat } from '../../types/stats';

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

interface ContinueChartProps {}

type Props = ReturnType<typeof mapStateToProps> & ContinueChartProps;

export const WeeklyChart: React.FunctionComponent<Props> = ({ data }) => {
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
                data: data.map((stat: TimelineStat) => stat.count),
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
                    yAxes: [
                        {
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
    data: state.stats.weekly.clips,
});

export default connect(mapStateToProps)(WeeklyChart);
