import React, { useEffect, Fragment } from 'react';
import { GallonStock, BorrowsAndReturns } from './Borrowing/index';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { fetchStocks } from '../../redux/actions';
import { CustomSpinner } from '../../components';
import { intlMessage } from '../../language';

const Borrowing = ({ fetchStocks, loading, language }) => {
    useEffect(() => {
        fetchStocks();
    }, []);
    
    const {
        borrowing: { title, stock, table },
    } = intlMessage(language);

    return (
        <Container fluid>
            {!loading ? (
                <Fragment>
                    <h1 className="mb-3 page-title">{title}</h1>
                    <Container fluid>
                        <Row>
                            <Col xs="12" sm="3" lg="2">
                                <GallonStock />
                            </Col>
                            <Col xs="12" sm="9" lg="10">
                                <BorrowsAndReturns language={table} />
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
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(Borrowing);
