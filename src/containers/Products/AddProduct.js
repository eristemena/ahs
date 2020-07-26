import React, { useState } from 'react';
import { ProductForm } from '../../components/Forms';
import { postWithAuth } from '../../axios';
import { connect } from 'react-redux';
import { addAlert } from '../../redux/actions/alert';

const AddProduct = ({ history, alert }) => {
    const [submitting, setSubmitting] = useState(false);

    const submitHandler = (name, price, buying_price) => {
        setSubmitting(true);
        postWithAuth(
            '/products',
            {
                name,
                price,
                buying_price,
            },
            (success) => {
                alert('Produk berhasil ditambahkan', 'success');
                setSubmitting(false);
                history.push('/products/get');
            },
            (error) => {
                console.log(error);
                setSubmitting(false);
                alert(`Telah terjadi kesalahan: ${error}`);
            }
        );
    };
    return (
        <div>
            <ProductForm
                onSubmit={submitHandler}
                submitting={submitting}
                history={history}
            />
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(null, mapDispatchToProps)(AddProduct);
