import React, { useState, useEffect } from 'react';
import { ProductForm } from '../../components/Forms';
import { put, get } from '../../axios';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';

const EditProduct = ({ user, history, alert }) => {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [buyingPrice, setBuyingPrice] = useState('');

    useEffect(() => {
        setLoading(true);
        if (user.merchant_id === null || user.group_id !== 1) {
            alert('Login sebagai admin merchant untuk menambahkan produk');
            history.push('/products/get');
        }
        const prodNotFound = () => {
            alert('Product not found');
            history.push('/products/get');
        };

        const search = history.location.search;

        if (!search.length > 0) {
            history.push('/products/get');
            return alert('Telah terjadi kesalahan');
        }

        if (!search.includes('id')) {
            history.push('/products/get');
            return alert('Telah terjadi kesalahan');
        }

        const queryId = search.replace('?id=', '');

        if (!queryId.match(/^\d+$/)) {
            history.push('/products/get');
            return alert('Telah terjadi kesalahan');
        }

        setId(queryId);
        get(
            `/products?id=${queryId}`,
            ({ data }) => {
                setLoading(false);
                const product = data[0];
                setName(product.name);
                setPrice(product.price);
                setBuyingPrice(product.buying_price);
            },
            (error) => {
                setLoading(false);
                history.push('/products/get');
                alert('Telah terjadi kesalahan');
            }
        );
    }, []);

    const submitHandler = (name, price, buying_price) => {
        setLoading(true);
        put(
            `/products/${id}`,
            {
                name,
                price,
                buying_price,
            },
            (success) => {
                alert('Produk berhasil diedit', 'success');
                setLoading(false);
                history.push('/products/get');
            },
            (error) => {
                setLoading(false);
                alert(`Telah terjadi kesalahan: ${error}`);
            }
        );
    };
    return !loading ? (
        <div>
            <ProductForm
                onSubmit={submitHandler}
                loading={submitting}
                stateName={name}
                statePrice={price}
                stateBuyingPrice={buyingPrice}
                action="Edit"
                history={history}
            />
        </div>
    ) : (
        <div></div>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
