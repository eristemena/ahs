import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { put, get } from '../../axios';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { errorHandler } from '../../utilities';

const GetStocks = ({ history, alert, logout }) => {
    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        get(
            '/products_groups',
            ({ data }) => {
                setItems(data);
                setLoading(false);
            },
            (error) => {
                errorHandler(error, alert, logout);
            }
        );
    }, []);

    const onClick = () => {
        if (items && items.length > 0) {
            setLoading(true);
            items.forEach((item, index) => {
                put(
                    `/products_groups/refresh_stocks/${item.id}`,
                    {},
                    () => {
                        if (index + 1 === items.length) {
                            get(
                                '/products_groups',
                                ({ data }) => {
                                    setItems(data);
                                    setLoading(false);
                                },
                                (error) => {
                                    setLoading(true);
                                    errorHandler(error, alert, logout);
                                }
                            );
                        }
                    },
                    (error) => {
                        setLoading(true);
                        errorHandler(error, alert, logout);
                    }
                );
            });
        }
    };
    return (
        <Card className="mt-2">
            <div className="custom-button d-flex">
                <button
                    className={`refresh-button ${loading ? 'spin' : ''}`}
                    disabled={loading}
                    title="Refresh"
                    onClick={onClick}>
                    <i className="simple-icon-refresh" />
                </button>
                <button
                    className="go-to-button"
                    onClick={() => history.push('/products/groups/get')}
                    title="Go to page">
                    <i className="simple-icon-action-redo"></i>
                </button>
            </div>
            <CardTitle className="p-3 m-0">
                <h3>Product Stock</h3>
            </CardTitle>
            <CardBody className="pt-0 text-center">
                {items ? (
                    <Row>
                        {items.map(({ id, name, quantity }) => (
                            <Col
                                key={id}
                                md={3}
                                sm={6}
                                xs={12}
                                className="mb-2">
                                <Card className="w-100">
                                    <CardBody>
                                        <h5
                                            className={`card-title ${
                                                quantity > 0 && 'text-success'
                                            } ${
                                                quantity === 0 &&
                                                'text-secondary'
                                            } ${
                                                quantity < 0 && 'text-danger'
                                            } font-weight-bold`}>
                                            {quantity}
                                        </h5>
                                        <p className="card-text mb-0">{name}</p>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <span className="position-relative">
                        Anda belum menambahkan grup produk,{' '}
                        <Link
                            to="/products/groups/add"
                            className="stretched-link text-decoration-none">
                            silahkan tambah grup baru
                        </Link>
                    </span>
                )}
            </CardBody>
        </Card>
    );
};

export default GetStocks;
