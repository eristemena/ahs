import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types'

const StockCard = ({stock, product_name}) => (
    <Card className="w-100">
        <CardBody>
            <h5
                className={`card-title ${
                    stock > 0 && 'text-success'
                } ${stock === 0 && 'text-secondary'} ${
                    stock < 0 && 'text-danger'
                } font-weight-bold`}>
                {stock}
            </h5>
            <p className="card-text mb-0">{product_name}</p>
        </CardBody>
    </Card>
) 

StockCard.propTypes = {
    stock: PropTypes.number.isRequired,
    product_name: PropTypes.string.isRequired
}

export default StockCard
