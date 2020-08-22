import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { PieChart } from '../../components/Charts';
import { connect } from 'react-redux';

const StockPieChart = ({ stock }) => {
    const pieChartDataMap = (stocks) => {
        return stocks.data ? stocks.data.map((stocc) => ({
            label: stocc.name,
            data: stocc.stock,
            color: {
                red: Math.random() * 255,
                green: Math.random() * 255,
                blue: Math.random() * 255
            }
        })) : []
    }
    return (
        <Card className="shadow mt-3 h-100">
            <CardBody>
                <CardTitle>
                    <h3>Stock</h3>
                </CardTitle>
            </CardBody>
            <PieChart data={pieChartDataMap(stock)} displayLegend={true} />
        </Card>
    );
};

const mapStateToProps = (state) => ({
    stock: state.stock,
});

export default connect(mapStateToProps)(StockPieChart);
