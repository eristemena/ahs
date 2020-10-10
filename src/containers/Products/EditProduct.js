import React, { useState, useEffect, Fragment } from 'react';
import { ProductForm } from '../../components/Forms';
import { put, get } from '../../axios';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';
import { checkAdminMerchant } from '../../utilities';
import CustomSpinner from '../../components/CustomSpinner';
import { setLoading } from '../../redux/actions/loading';

const EditProduct = ({ user, history, alert, loading, setLoading }) => {
    const [submitting, setSubmitting] = useState(false);
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [buyingPrice, setBuyingPrice] = useState(null);
    const [group, setGroup] = useState(null)

    useEffect(() => {
        setLoading(true);
        if (!checkAdminMerchant(user)) {
            alert('Login sebagai admin merchant untuk menambahkan produk');
            return history.push('/products/get');
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
                const product = data[0];
                setName(product.name);
                setPrice(product.price);
                setBuyingPrice(product.buying_price);
                setGroup(product.group_id)
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                history.push('/products/get');
                alert(`Telah terjadi kesalahan${error ? `: ${error.message}` : ''}.`);
            }
        );
    }, []);

    const submitHandler = (name, price, buying_price, group_id) => {
        setSubmitting(true);
        put(
            `/products/${id}`,
            {
                name,
                price,
                buying_price,
                group_id
            },
            (success) => {
                alert('Produk berhasil diedit', 'success');
                setSubmitting(false);
                history.push('/products/get');
            },
            (error) => {
                setSubmitting(false);
                alert(`Telah terjadi kesalahan: ${error.message}`);
            }
        );
    };
    return (
        <Fragment>
            {!loading ? (
                <ProductForm
                    onSubmit={submitHandler}
                    submitting={submitting}
                    stateName={name}
                    statePrice={price}
                    stateBuyingPrice={buyingPrice}
                    stateGroup={group}
                    action="Edit"
                    history={history}
                />
            ) : (
                <CustomSpinner loading={loading} type="page" />
            )}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.loading,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
