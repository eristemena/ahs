import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';

const ProductStock = ({ product_name, stock }) => {
    return (
        <Col>
            <div className="card shadow mx-2 mb-2">
                <div className="card-body">
                    <h5
                        className={`card-title ${stock > 0 && 'text-success'} ${
                            stock === 0 && 'text-secondary'
                        } ${stock < 0 && 'text-danger'} font-weight-bold`}>
                        {stock}
                    </h5>
                    <p className="card-text mb-0">{product_name}</p>
                    <Link to="/" className="stretched-link" />
                </div>
            </div>
        </Col>
    );
};

export default connect()(ProductStock);
