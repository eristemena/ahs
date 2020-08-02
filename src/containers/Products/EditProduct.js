import React, { useState, useEffect, Fragment } from 'react';
import { ProductForm } from '../../components/Forms';
import { put, get } from '../../axios';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';
import CustomSpinner from '../../components/CustomSpinner';
import { setLoading } from '../../redux/actions/loading';

const EditProduct = ({ user, history, alert, loading, setLoading }) => {
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

        if (isNaN(queryId)) {
            history.push('/products/get');
            return alert('Telah terjadi kesalahan');
        }

        setId(queryId);
        get(
            `/products?id=${queryId}`,
            ({ data }) => {
                setLoading(false);
                console.log(data)
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
        setSubmitting(true);
        put(
            `/products/${id}`,
            {
                name,
                price,
                buying_price,
            },
            (success) => {
                alert('Produk berhasil diedit', 'success');
                setSubmitting(false);
                history.push('/products/get');
            },
            (error) => {
                setSubmitting(false);
                alert(`Telah terjadi kesalahan: ${error}`);
            }
        );
    };
    return (
        <Fragment>
            <CustomSpinner loading={loading} type="page" />
            <ProductForm
                onSubmit={submitHandler}
                submitting={submitting}
                stateName={name}
                statePrice={price}
                stateBuyingPrice={buyingPrice}
                action="Edit"
                history={history}
            />
        </Fragment>
    )
};

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.loading
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
