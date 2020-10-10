import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { GetStocks } from './Stocks';
import { Cards } from './Reports/Sales/index';
import { Container, Row, Col, CardTitle, Card, CardBody } from 'reactstrap';
import { get } from '../axios';
import { setLoading, addAlert, getProductStocks, logout } from '../redux/actions';
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
    logout
}) {
    const [income, setIncome] = useState(0);
    const [spending, setSpending] = useState(0);
    const [revenue, setRevenue] = useState(0);

    const [products, setProducts] = useState(null)
    const [productLoading, setProductLoading] = useState(false)

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
                    if (error) {
                        if (error.message === 'jwt expired, please login.') {
                            alert(
                                'Anda belum login setelah seminggu. Harap login lagi.'
                            );
                            logout();
                        } else if (error.message !== 'Need authorization header') {
                            alert(
                                `Telah terjadi kesalahan${
                                    error ? `: ${error.message}` : ''
                                }.`
                            );
                        }
                    } else {
                        alert(
                            `Telah terjadi kesalahan${
                                error ? `: ${error.message}` : ''
                            }.`
                        );
                    }
                    setLoading(false);
                }
            );
            get(
                '/products_groups',
                ({data}) => {
                    setProducts(data);
                    setLoading(false)
                },
                (error) => {
                    if (error) {
                        if (error.message === 'jwt expired, please login.') {
                            alert(
                                'Anda belum login setelah seminggu. Harap login lagi.'
                            );
                            logout();
                        } else if (error.message !== 'Need authorization header') {
                            alert(
                                `Telah terjadi kesalahan${
                                    error ? `: ${error.message}` : ''
                                }.`
                            );
                        }
                    } else {
                        alert(
                            `Telah terjadi kesalahan${
                                error ? `: ${error.message}` : ''
                            }.`
                        );
                    }
                    setLoading(false);
                }
            )
        }
    }, []);

    const goToButton = (onClick) => (
        <div className="custom-button">
            <button
                className="goto-button"
                onClick={onClick}
                title="Go to page">
                <i className="simple-icon-action-redo"></i>
            </button>
        </div>
    )

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
                                {goToButton(() => history.push('/transactions/get'))}
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
    getProductStocks: () => dispatch(getProductStocks()),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
