import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { Line } from 'react-chartjs-2';

const LineChart = ({
    viewName = '',
    data = [],
    labels = [],
    displayLegend = false,
    legends = [],
    title = '',
}) => {
    return (
        <Card className="mx-2 mb-2 custom-chart h-100 w-100">
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
                                          type: 'line',
                                          backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, 0.1)`,
                                          borderColor: `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`,
                                          pointRadius: 7,
                                          pointBorderWidth: 2,
                                          pointHoverRadius: 9,
                                          pointBackgroundColor: `white`,
                                          pointHoverBackgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`,
                                      }))
                                    : [],
                        }}
                        options={{
                            scales: {
                                xAxes: [{ gridLines: { display: false } }],
                            },
                            title: {
                                display: true,
                                text: title,
                                position: 'left',
                                fontFamily: "'Nunito', sans-serif",
                            },
                            maintainAspectRatio: true
                        }}
                        height={120}
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

LineChart.propTypes = {
    viewName: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    displayLegend: PropTypes.bool,
    legends: PropTypes.array,
    title: PropTypes.string,
};

export default LineChart;
