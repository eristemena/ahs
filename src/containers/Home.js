import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { GetStocks, GetSales, StockPieChart } from './Stocks';
import { Container, Row, Col } from 'reactstrap';

function Home({ merchant_id }) {
    return (
        <Container fluid>
            {merchant_id ? (
                <Fragment>
                    <Row xs="1" sm="2" md="4" lg="5">
                        {/* <GetStocks /> */}
                    </Row>
                    <Row>
                        <Col md={8}>
                            <GetSales />
                        </Col>
                        <Col md={4}>
                            {/* <StockPieChart /> */}
                        </Col>
                    </Row>
                </Fragment>
            ) : (
                <h1>Welcome Admin</h1>
            )}
        </Container>
    );
}

const mapStateToProps = (state) => ({
    merchant_id: state.user.merchant_id,
});

export default connect(mapStateToProps)(Home);
