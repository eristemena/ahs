import React from 'react';
import { connect } from 'react-redux';
import { GetStocks, GetSales, StockPieChart } from './Stocks';
import { Container, Row, Col } from 'reactstrap';

function Home({ user }) {
    return (
        <Container fluid>
            <Row xs="1" sm="2" md="4" lg="5">
                {user.merchant_id ? (
                    <GetStocks />
                ) : (
                    <h1 className="">Welcome Admin</h1>
                )}
            </Row>
            <Row>
                <Col md={8}>
                    <GetSales />
                </Col>
                <Col md={4}>
                    <StockPieChart />
                </Col>
            </Row>
        </Container>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(Home);
