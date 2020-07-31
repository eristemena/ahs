import React from 'react';
import { connect } from 'react-redux';
import { GetStocks, GetSales } from './Stocks';
import { Container, Row } from 'reactstrap';

function Home({ user }) {
    return (
        <Container fluid>
            <Row xs="1" sm="1" md="3" lg="3">
                {user.merchant_id ? (
                    <GetStocks />
                ) : (
                    <h1 className="">Welcome Admin</h1>
                )}
            </Row>
            <GetSales />
        </Container>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(Home);
