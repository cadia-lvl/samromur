import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { TimelineSumStat } from '../../types/stats';
import { useTranslation } from '../../server/i18n';

moment.locale('is');

//const dateFormatter = (item: any) => moment(item).format('DD MMM');

interface ContinueChartProps {}

type Props = ReturnType<typeof mapStateToProps> & ContinueChartProps;

export const TotalChart: React.FunctionComponent<Props> = ({ data }) => {
    const { t } = useTranslation('charts');
    const dateFormatter = (item: any) => {
        const newest = data[data.length - 1].date == item;
        const oldest = data[0].date == item;
        if (newest) {
            return t('today');
        } else if (oldest) {
            console.log(item);
            return moment(item).format('D. MMMM');
        } else {
            return '';
        }
    };

    const tickFormatter = (value: any) => {
        return `${value / 1000} ${t('thousands')}.`;
    };

    const chartData = () => ({
        data: {
            labels: data.map((stat: TimelineSumStat) =>
                dateFormatter(stat.date)
            ),
            datasets: [
                {
                    fill: false,
                    pointRadius: 0,
                    label: '',
                    borderWidth: 6,
                    lineTension: 0.2,
                    borderColor: 'rgb(98,159,244,96)',
                    data: data.map((stat: TimelineSumStat) => stat.sum),
                },
            ],
        },
        min:
            Math.floor(Math.min(...data.map((val) => val.sum)) / 1000) * 1000 -
            1000,
        max: Math.ceil(Math.max(...data.map((val) => val.sum)) / 1000) * 1000,
    });

    return (
        <Line
            data={chartData().data}
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
                            ticks: {
                                fontSize: 14,
                                padding: 15,
                                maxRotation: 0,
                                maxTicksLimit: 1,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                fontSize: 14,
                                min: chartData().min,
                                max: chartData().max,
                                maxTicksLimit: 6,
                                callback: tickFormatter,
                            },
                        },
                    ],
                },
            }}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    data: state.stats.totalClipsTimeline,
});

export default connect(mapStateToProps)(TotalChart);
