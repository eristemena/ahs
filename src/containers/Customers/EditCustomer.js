import React, { useState, useEffect, Fragment } from 'react';
import CustomerForm from '../../components/CustomerForm';
import { connect } from 'react-redux';
import { put, get } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { setLoading } from '../../redux/actions/loading';
import CustomSpinner from '../../components/CustomSpinner'

const EditCustomer = ({ history, alert, setLoading, loading }) => {
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        setLoading(true);
        if (!history.location.search.includes('id')) {
            history.push('/customers/get');
            return alert('Telah terjadi kesalahan');
        }

        const id = history.location.search.replace('?id=', '');

        if (isNaN(id)) {
            history.push('/customers/get');
            return alert('Telah terjadi kesalahan');
        }

        get(
            `/customers?id=${id}`,
            ({ data }) => {
                if (data.length === 0) {
                    history.push('/customers/get');
                    return alert('Customer tidak ditemukan');
                }
                const { name, email, phone, address } = data[0];
                setName(name);
                if (email) {
                    setEmail(email);
                }
                setPhone(phone);
                setAddress(address);
                setLoading(false);
            },
            (error) => {
                history.push('/customers/get');
                alert('Telah terjadi kesalahan');
                setLoading(false);
            }
        );
    }, []);

    const submitHandler = (name, email, phone, address) => {
        setSubmitting(true);
        const id = history.location.search.replace('?id=', '');
        put(
            `/customers/${id}`,
            {
                name,
                email,
                phone,
                address,
            },
            (success) => {
                setSubmitting(false);
                alert('Pelanggan berhasil diedit', 'success');
                history.push('/customers/get');
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                setSubmitting(false);
            }
        );
    };
    return (
        <Fragment>
            <CustomSpinner loading={loading} type="page" />
            {!loading ? (
                <CustomerForm
                submitting={submitting}
                onSubmit={submitHandler}
                stateName={name}
                stateEmail={email}
                statePhone={phone}
                stateAddress={address}
                history={history}
            />
            ) : null}
            
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    loading: state.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
