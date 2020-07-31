import React from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardBody,
    CardTitle,
} from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';

const PieChart = ({
    viewName = '',
    data = [],
    displayLegend = false,
    title = ''
}) => {

    return (
        <Card className="mx-2 mb-2 h-100 custom-chart">
            <CardBody>
                <CardTitle className="">
                    <h5 className="text-center">{viewName}</h5>
                </CardTitle>
                <Doughnut 
                    data={{
                        labels: data.map(({label}) => label),
                        datasets: [
                            {
                                data: data.map(({data}) => data),
                                backgroundColor: data.map(({color}) => `rgba(${color.red}, ${color.green}, ${color.blue}, 0.3)`),
                                hoverBackgroundColor: data.map(({color}) => `rgba(${color.red}, ${color.green}, ${color.blue}, 0.5)`),
                                borderColor: data.map(({color}) => `rgba(${color.red}, ${color.green}, ${color.blue}, 0.7`),
                                borderAlign: 'inner',
                                borderWidth: 3,
                                hoverBorderColor: data.map(() => 'rgba(0, 0, 0, 0)')
                            },
                        ],
                    }}
                    options={{
                        legend: {position: 'bottom', labels: {usePointStyle: true}},
                        title: {display: title.length > 0, text: title, position: 'top'}
                    }}
                    height={250}
                    legend={{ display: displayLegend }}
                />
            </CardBody>
        </Card>
    );
};

PieChart.propTypes = {
    viewName: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    displayLegend: PropTypes.bool,
    title: PropTypes.string,
};

export default PieChart;
