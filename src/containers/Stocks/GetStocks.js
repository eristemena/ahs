import React, { Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions';
import { StockCard } from '../../components/Stocks';

const GetSales = ({ products }) => {

    return (
        <Fragment>
            <Row>
                {products && products.map(({id, name, stock}) => (
                    <Col key={id} md={3} sm={6} xs={12} className="mb-2">
                        <StockCard product_name={name} stock={stock} />
                    </Col>
                ))}
            </Row>
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(null, mapDispatchToProps)(GetSales);
