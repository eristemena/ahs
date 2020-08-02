import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import ProductStock from '../../components/ProductStock';
import { getStocks } from '../../redux/actions/stock';
import { Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';

const GetStocks = ({ stock, getStocks }) => {
    useEffect(() => {
        getStocks();
    }, []);

    return (
        <Fragment>
            {stock.data ?
                stock.data.map((own) => (
                    <Col key={own.product_id} className="p-2">
                        <ProductStock
                            product_name={own.name}
                            stock={own.stock}
                        />
                    </Col>
                )) : null}
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    getStocks: () => dispatch(getStocks()),
});

const mapStateToProps = (state) => ({
    stock: state.stock,
    loading: state.loading,
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(GetStocks)
);
