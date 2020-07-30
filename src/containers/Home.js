import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { GetStocks, GetSales } from './Stocks';
import { Container, Row, Col } from 'reactstrap';
import CustomSpinner from '../components/CustomSpinner';

function Home({ merchant_id, loading, history }) {
    const [stockView, setStockView] = useState();

    return (
        <Fragment>
            <CustomSpinner loading={loading} type="page" />
            <Container fluid>
                <Row xs="1" sm="1" md="3" lg="3">
                    {merchant_id ? (
                        <GetStocks />
                    ) : (
                        <h1 className="">Welcome Admin</h1>
                    )}
                </Row>
                <Row>
                    <Col>
                        <GetSales />
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    merchant_id: state.user.merchant_id,
    loading: state.loading,
});

export default connect(mapStateToProps)(Home);
