import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';

const GallonStock = ({ gallon_stock }) => {
    return (
        <Card className="mb-2">
            <CardBody className="p-3 text-center">
                <p>Gallon stock:</p>
                <h3 className="text-success">
                    {gallon_stock.data.stock || null}
                </h3>
            </CardBody>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    gallon_stock: state.gallon_stock,
});

export default connect(mapStateToProps)(GallonStock);
