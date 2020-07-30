import React, { useEffect } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { getSales } from '../../redux/actions/sale';

const GetSales = ({ sale, getSales }) => {
    const defBottomLables = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        getSales();
    }, []);

    return (
        <Card className="shadow mx-2 custom-chart position-relative">
            <CardBody>
                <CardTitle className="mb-3">
                    <div className="d-flex justify-content-between">
                        <h3>Sales</h3>
                    </div>
                </CardTitle>
                <Line
                    data={{
                        labels: sale.data
                            ? sale.data.map((sal) => sal.day)
                            : defBottomLables,
                        datasets: [
                            {
                                data: sale.data
                                    ? sale.data.map((sal) => sal.sales)
                                    : [],
                                backgroundColor: 'rgba(0, 142, 204, 0.1)',
                                borderColor: 'rgba(0, 142, 204, 1)',
                                pointRadius: 7,
                                pointHoverRadius: 9,
                                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                                pointHoverBackgroundColor:
                                    'rgba(0, 142, 204, 1)',
                            },
                        ],
                    }}
                    options={{
                        scales: { xAxes: [{ gridLines: { display: false } }] },
                    }}
                    height={120}
                    legend={{ display: false }}
                />
            </CardBody>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    sale: state.sale,
});

const mapDispatchToProps = (dispatch) => ({
    getSales: (code) => dispatch(getSales(code)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GetSales);
