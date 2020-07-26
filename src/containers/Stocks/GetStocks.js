import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';
import ProductStock from '../../components/ProductStock';
import { getStocks } from '../../redux/actions/stock';
import CustomSpinner from '../../components/CustomSpinner';
import { Row, Col } from 'reactstrap';

const GetStocks = ({ stock, getStocks, loading }) => {
    useEffect(() => {
        getStocks();
    }, []);

    return (
        <div className="container">
            <CustomSpinner loading={loading} type="page" />
            <Row xs="1" md="2" lg="3">
                {!loading ? (
                    <Fragment>
                        {stock &&
                            stock.data.map((own) => (
                                <Col key={own.product_id}>
                                    <ProductStock
                                        product_name={own.name}
                                        stock={own.stock}
                                    />
                                </Col>
                            ))}
                    </Fragment>
                ) : null}
            </Row>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    getStocks: () => dispatch(getStocks()),
});

const mapStateToProps = (state) => ({
    stock: state.stock,
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetStocks);
