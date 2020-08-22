import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { longFunction } from './PieChartCenterText';

const PieChart = ({
    viewName = '',
    data = [],
    displayLegend = false,
    title = '',
}) => {
    const [centerText, setCenterText] = useState('');

    useEffect(() => {
        longFunction()
    }, [])

    return (
        <Card className="mx-2 mb-2 h-100 custom-chart">
            <CardBody>
                <CardTitle className="">
                    <h5 className="text-center">{viewName}</h5>
                </CardTitle>
                <Doughnut
                    data={{
                        labels: data.map(({ label }) => label),
                        datasets: [
                            {
                                data: data.map(({ data }) => data),
                                backgroundColor: data.map(
                                    ({ color }) =>
                                        `rgba(${color.red}, ${color.green}, ${color.blue}, 0.5)`
                                ),
                                hoverBackgroundColor: data.map(
                                    ({ color }) =>
                                        `rgba(${color.red}, ${color.green}, ${color.blue}, 0.5)`
                                ),
                                borderColor: data.map(
                                    ({ color }) =>
                                        `rgba(${color.red}, ${color.green}, ${color.blue}, 0.1)`
                                ),
                                borderAlign: 'inner',
                                borderWidth: 4,
                                hoverBorderColor: data.map(
                                    () => 'rgba(255, 255, 255, 1)'
                                ),
                            },
                        ],
                    }}
                    options={{
                        legend: {
                            position: 'bottom',
                            labels: { usePointStyle: true },
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipModel, data) {
                                    let { labels, datasets } = data;
                                    let { index } = tooltipModel;
                                    const percentage = (
                                        (datasets[0].data[index] /
                                            datasets[0].data.reduce(
                                                (a, b) => a + b,
                                                0
                                            )) *
                                        100
                                    ).toFixed(2);
                                    setCenterText(`${labels[index]}: ${percentage}%`)
                                    return `${labels[index]}: ${datasets[0].data[index]}`;
                                },
                            },
                        },
                        title: {
                            display: title.length > 0,
                            text: title,
                            position: 'top',
                        },
                        elements: {
                            center: {
                                text: centerText,
                                color: '#008ecc',
                                fontStyle: 'Nunito',
                                sidePadding: 20,
                                minFontSize: 17,
                                lineHeight: 25,
                            },
                        },
                    }}
                    height={300}
                    width={200}
                    legend={{ display: displayLegend }}
                />
            </CardBody>
        </Card>
    );
};

PieChart.propTypes = {
    viewName: PropTypes.string,
    data: PropTypes.array.isRequired,
    displayLegend: PropTypes.bool,
    title: PropTypes.string,
};

export default PieChart;
