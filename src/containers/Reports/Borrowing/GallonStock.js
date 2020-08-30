import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { get } from '../../../axios';

const GallonStock = ({ gallon_stock, history }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        get(
            '/stocks/report',
            ({ data }) => {
                setTotal(data.totalBorrowedGallons);
            },
            (error) => {
                history.push('/');
            }
        );
    }, []);

    return (
        <Card className="mb-2">
            <CardBody className="text-center stocks-card">
                <p>Gallon stock:</p>
                <h3 className="text-success">
                    {gallon_stock.data && gallon_stock.data.stock}
                </h3>
                <div class="dropdown-divider"></div>
                <p className="mt-3">Total borrowed:</p>
                <h3 className="text-success mb-0">{total}</h3>
            </CardBody>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    gallon_stock: state.gallon_stock,
});

export default withRouter(connect(mapStateToProps)(GallonStock));
