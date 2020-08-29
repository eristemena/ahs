import React, { useEffect, Fragment } from 'react';
import { GallonStock, BorrowsAndReturns } from '.';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { fetchStocks } from '../../redux/actions';
import { CustomSpinner } from '../../components';

const Borrowing = ({ fetchStocks, loading }) => {
    useEffect(() => {
        fetchStocks();
    }, []);
    return (
        <Container fluid>
            {!loading ? (
                <Fragment>
                    <h1 className="mb-3">Report</h1>
                    <Container fluid>
                        <Row>
                            <Col xs="12" sm="3" lg="2">
                                <GallonStock />
                            </Col>
                            <Col xs="12" sm="9" lg="10">
                                <BorrowsAndReturns />
                            </Col>
                        </Row>
                    </Container>
                </Fragment>
            ) : (
                <CustomSpinner loading={loading} type="page" />
            )}
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    fetchStocks: () => dispatch(fetchStocks()),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(Borrowing);
