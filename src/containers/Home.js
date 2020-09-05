import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { GetStocks, GetSales, StockPieChart } from './Stocks';
import { GallonStock } from './Reports/Borrowing/index';
import { Cards } from './Reports/Sales/index';
import { Container, Row, Col, CardTitle, Card, CardBody } from 'reactstrap';
import { get } from '../axios';
import { setLoading } from '../redux/actions';
import { CustomSpinner } from '../components';
import moment from 'moment';
import { intlMessage } from '../language';
import { getProducts } from '../redux/actions';

function Home({
    merchant_id,
    setLoading,
    loading,
    history,
    language,
    getProducts,
}) {
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        if (merchant_id) {
            getProducts();
            setLoading(true);
            get(
                `/transactions/revenue?date=${moment().format('YYYY-MM-DD')}`,
                ({ data }) => {
                    setIncome(data.income);
                    setSpending(data.spending);
                    setRevenue(data.revenue);
                    setLoading(false);
                },
                (error) => {
                    history.push('/');
                    setLoading(false);
                    alert('Telah terjadi kesalahan');
                }
            );
        }
    }, []);

    const { sales } = intlMessage(language);

    return (
        <Fragment>
            {!loading ? (
                <Container fluid>
                    {/* <Col xs="12" md="3" className="mb-2">
                                    <GallonStock />
                                </Col> */}
                    {merchant_id ? (
                        <Fragment>
                            <Card className="">
                                <div className="custom-button">
                                    <button
                                        className="goto-button"
                                        onClick={() => history.push('/reports/sales')}
                                        title="Go to page">
                                        <i className="simple-icon-action-redo"></i>
                                    </button>
                                </div>
                                <CardTitle className="p-3 m-0">
                                    <h3>Sales (Today)</h3>
                                </CardTitle>
                                <CardBody className="pt-0">
                                    <Row>
                                        <Col xs="12" sm="4" className="mb-2">
                                            <Cards
                                                title={sales.cards.income}
                                                number={income}
                                                color="dark"
                                            />
                                        </Col>
                                        <Col xs="12" sm="4" className="mb-2">
                                            <Cards
                                                title={sales.cards.spending}
                                                number={spending}
                                                color="dark"
                                            />
                                        </Col>
                                        <Col xs="12" sm="4" className="mb-2">
                                            <Cards
                                                title={sales.cards.revenue}
                                                number={revenue}
                                            />
                                        </Col>
                                    </Row>
                                    <GetSales />
                                </CardBody>
                            </Card>
                        </Fragment>
                    ) : (
                        <h1>Welcome Admin</h1>
                    )}
                </Container>
            ) : (
                <CustomSpinner type="page" loading={loading} />
            )}
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    merchant_id: state.user.merchant_id,
    loading: state.loading,
    language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (loading) => dispatch(setLoading(loading)),
    getProducts: () => dispatch(getProducts(1, null, 0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
