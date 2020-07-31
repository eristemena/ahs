import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
} from 'reactstrap';
import { LineChart, PieChart } from '../../components/Charts';
import { connect } from 'react-redux';
import { getSales } from '../../redux/actions/sale';

const GetSales = ({ sale, getSales }) => {
    const [graphWeekCode, setGraphWeekCode] = useState(1);

    const defBottomLables = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const views = [
        {
            code: 1,
            name: 'This Week',
        },
        {
            code: 2,
            name: 'Last week',
        },
    ];

    useEffect(() => {
        getSales(graphWeekCode);
    }, [graphWeekCode]);

    const lineChartDataMapping = (sales) => {
        return [
            {
                data: sales.data.map(
                    ({ detail }) =>
                        detail.sells
                            .map(({ quantity }) => quantity)
                            .reduce((a, b) => a + b, 0) * -1
                ),
                label: 'Sales',
                color: {
                    red: 0,
                    green: 142,
                    blue: 204,
                },
            },
            {
                data: sales.data.map(({ detail }) =>
                    detail.buys
                        .map(({ quantity }) => quantity)
                        .reduce((a, b) => a + b, 0)
                ),
                label: 'Buys',
                color: {
                    red: 0,
                    green: 202,
                    blue: 204,
                },
            },
            {
                data: sales.data.map((data) => data.sales),
                label: 'Total',
                color: {
                    red: 128,
                    green: 128,
                    blue: 128,
                },
            },
        ];
    };

    const doughnutChartDataMapping = (sales) => {
        return [
            {
                label: 'Sells',
                data: sales.data
                    .map(({ detail }) =>
                        detail.sells
                            .map(({ quantity }) => quantity)
                            .reduce((a, b) => a + b, 0)
                    )
                    .reduce((a, b) => a + b, 0),
                color: {
                    red: 0,
                    green: 142,
                    blue: 204,
                },
            },
            {
                label: 'Buys',
                data: sales.data
                    .map(({ detail }) =>
                        detail.buys
                            .map(({ quantity }) => quantity)
                            .reduce((a, b) => a + b, 0)
                    )
                    .reduce((a, b) => a + b, 0),
                color: {
                    red: 0,
                    green: 202,
                    blue: 204,
                },
            },
        ];
    };

    return (
        <Card className="shadow">
            <CardBody>
                <CardTitle className="d-flex justify-content-between">
                    <h3>Sales</h3>
                    <UncontrolledDropdown>
                        <DropdownToggle className="d-flex justify-content-center justify-content-md-between align-middle dropdown-button dropdown-button-primary outline">
                            <i className="mr-2">
                                {views[graphWeekCode - 1].name}
                            </i>
                            <i className="simple-icon-arrow-down mt-1"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                            {views.map((view) => (
                                <DropdownItem
                                    key={view.code}
                                    onClick={() => setGraphWeekCode(view.code)}>
                                    {view.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </CardTitle>
                <Row>
                    <Col md={8} className="mb-3 mb-md-0 d-none d-sm-block">
                        <div className="d-flex">
                            <LineChart
                                viewName="Line"
                                viewCode={graphWeekCode}
                                setViewCode={setGraphWeekCode}
                                view={views}
                                labels={
                                    sale.data
                                        ? sale.data.map((s) => s.day)
                                        : defBottomLables
                                }
                                data={
                                    sale.data ? lineChartDataMapping(sale) : []
                                }
                                displayLegend={true}
                                legends={['Sales', 'Buys']}
                                title="Quantity"
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <PieChart
                            viewName="Doughnut"
                            displayLegend={true}
                            labels={['Sells', 'Buys']}
                            data={
                                sale.data ? doughnutChartDataMapping(sale) : []
                            }
                            title="Quantity"
                        />
                    </Col>
                </Row>
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
