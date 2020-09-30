import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { GetStocks } from './Stocks';
import { Cards } from './Reports/Sales/index';
import { Container, Row, Col, CardTitle, Card, CardBody } from 'reactstrap';
import { get } from '../axios';
import { setLoading, addAlert, getProductStocks } from '../redux/actions';
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
    alert,
}) {
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        if (merchant_id) {
            setLoading(true);
            get(
                `/transactions/revenue?start_date=${moment().format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
                ({ data }) => {
                    setIncome(data.income);
                    setSpending(data.spending);
                    setRevenue(data.revenue);
                    setLoading(false);
                },
                (error) => {
                    setLoading(false);
                    alert('Telah terjadi kesalahan');
                }
            );
        }
    }, []);

    const [products, setProducts] = useState(null)
    const [productLoading, setProductLoading] = useState(false)
    const [productTemp, setProductTemp] = useState(false);

    useEffect(() => {
        if (merchant_id) {
            setProductLoading(true);
                get(
                    '/products/stocks',
                    ({data}) => {
                        setProducts(data);
                        setProductLoading(false)
                    },
                    (error) => {
                        alert('Telah terjadi kesalahan');
                        setProductLoading(false)
                    }
                )
        }
    }, [merchant_id ? productTemp : null])

    const { sales } = intlMessage(language);

    return (
        <Fragment>
            {!loading ? (
                <Container fluid>
                    <h1 className="page-title">Home</h1>
                    {merchant_id ? (
                        <Fragment>
                            <Card className="">
                                <div className="custom-button">
                                    <button
                                        className="goto-button"
                                        onClick={() =>
                                            history.push('/reports/sales')
                                        }
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
                                </CardBody>
                            </Card>
                            <Card className="mt-2">
                                <div className="custom-button">
                                    <button
                                        className="goto-button"
                                        onClick={() =>
                                            history.push('/transactions/get')
                                        }
                                        title="Go to page">
                                        <i className="simple-icon-action-redo"></i>
                                    </button>
                                    <button
                                        className={`refresh-button ${productLoading ? 'spin' : ''}`}
                                        disabled={productLoading}
                                        title="Refresh"
                                        onClick={() => setProductTemp(!productTemp)}>
                                        <i className="simple-icon-refresh" />
                                    </button>
                                </div>
                                <CardTitle className="p-3 m-0">
                                    <h3>Product Stock</h3>
                                </CardTitle>
                                <CardBody className="pt-0">
                                    <GetStocks products={products} loading={productLoading} />
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
    product_stock: state.product_stock
});

const mapDispatchToProps = (dispatch) => ({
    setLoading: (loading) => dispatch(setLoading(loading)),
    getProducts: () => dispatch(getProducts(1, null, 0)),
    alert: (message) => dispatch(addAlert(message)),
    getProductStocks: () => dispatch(getProductStocks())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
