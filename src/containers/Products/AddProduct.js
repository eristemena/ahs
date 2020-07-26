import React, { useState, useEffect } from 'react';
import { ProductForm } from '../../components/Forms';
import { postWithAuth } from '../../axios';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';

const AddProduct = ({ user, history, alert }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user.merchant_id === null || user.group_id !== 1) {
            history.push('/products/get');
            alert('Login sebagai admin merchant untuk menambahkan produk');
        }
    }, []);

    const submitHandler = (name, price, buying_price) => {
        setLoading(true);
        postWithAuth(
            '/products',
            {
                name,
                price,
                buying_price,
            },
            (success) => {
                alert('Produk berhasil ditambahkan', 'success');
                setLoading(false);
                history.push('/products/get');
            },
            (error) => {
                console.log(error);
                setLoading(false);
                alert(`Telah terjadi kesalahan: ${error}`);
            }
        );
    };
    return (
        <div>
            <ProductForm
                onSubmit={submitHandler}
                loading={loading}
                history={history}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
