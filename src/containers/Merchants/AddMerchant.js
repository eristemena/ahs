import React, { useState } from 'react';
import { postWithAuth, post } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { connect } from 'react-redux';
import RegisterForm from '../../components/RegisterForm';

const AddMerchant = ({ alert, history }) => {
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = (name, ahs, email, password) => {
        setLoading(true);
        postWithAuth(
            '/merchants',
            {
                name: ahs,
            },
            ({ data }) => {
                post(
                    '/auth/register',
                    {
                        name,
                        email,
                        password,
                        group_id: 1,
                        merchant_id: data.id,
                    },
                    (success) => {
                        setLoading(false);
                        alert('Merchant berhasil ditambahkan', 'success');
                        history.push('/merchants/get');
                    },
                    (error) => {
                        console.log(error);
                        alert('Telah terjadi kesalahan');
                    }
                );
            },
            (error) => {
                alert('Telah terjadi kesalahan');
            }
        );
    };
    return <RegisterForm loading={loading} onSubmit={onSubmitHandler} />;
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(null, mapDispatchToProps)(AddMerchant);
