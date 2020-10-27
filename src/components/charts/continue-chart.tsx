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
        return 'í dag'
    } else if (today == 5 || today == 3) {
        return '';
    } else {
        if (today == 6) {
            return 'fyrir viku';
        }
        return '';
    }
}

interface ContinueChartProps {
    contributeType: string;
    count: number;
}

type Props = ReturnType<typeof mapStateToProps> & ContinueChartProps;

export const ContinueChart: React.FunctionComponent<Props> = ({ contributeType, count, stats }) => {
    const data = contributeType == 'tala' ? stats.clips : stats.votes;
    const chartData = () => ({
        labels: data.map((stat: TimelineStat) => dateFormatter(stat.date)),
        datasets: [
            {
                label: '',
                backgroundColor: ['rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(96,193,151,1)'],
                hoverBackgroundColor: ['rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(0,153,255,1)', 'rgba(96,193,151,1)'],
                borderWidth: 0,
                data: data.map((stat: TimelineStat, index: number) => index == data.length - 1 ? stat.count + count : stat.count)
            }
        ]
    });

    return (
        <Bar
            data={chartData()}
            options={{
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false,
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                beginAtZero: true,
                            }
                        }
                    ]
                }
            }}
        />
    )
}

const mapStateToProps = (state: RootState) => ({
    stats: state.stats.weekly,
});

export default connect(
    mapStateToProps
)(ContinueChart);