import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Line } from 'react-chartjs-2';

const BarChart = ({
    viewName = '',
    data = [],
    labels = [],
    displayLegend = false,
    legends = [],
    customYAxis = () => {},
}) => {
    const [windowWidth, setWindowWidth] = useState(undefined);
    return (
        <Card className="custom-chart">
            <CardBody>
                <CardTitle className="mb-3">
                    <h5 className="text-center">{viewName}</h5>
                </CardTitle>
                <div className="d-flex">
                    <Line
                        data={{
                            labels: labels,
                            datasets:
                                data.length > 0
                                    ? data.map(({ data, label, color }) => ({
                                          data: data,
                                          label: label,
                                          type: 'bar',
                                          backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, 0.7)`,
                                          borderColor: `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`,
                                          borderSkipped: false,
                                      }))
                                    : [],
                        }}
                        options={{
                            scales: {
                                xAxes: [{ gridLines: { display: false }, ticks: {autoSkip: false} }],
                                yAxes: [
                                    {
                                        ticks: {
                                            callback: (label, value) => {
                                                if (value >= 0 && customYAxis) {
                                                    return `Rp. ${customYAxis(
                                                        label
                                                    )}`;
                                                }
                                            },
                                            min: 0,
                                        },
                                    },
                                ],
                            },
                        }}
                        height={160}
                        legend={{
                            display:
                                legends.length > 0 && displayLegend
                                    ? true
                                    : false,
                        }}
                    />
                </div>
            </CardBody>
        </Card>
    );
};

BarChart.propTypes = {
    viewName: PropTypes.string,
    data: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    displayLegend: PropTypes.bool,
    legends: PropTypes.array,
    title: PropTypes.string,
};

export default BarChart;
