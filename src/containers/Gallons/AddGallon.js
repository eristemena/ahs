import React, { useState, Fragment } from 'react';
import { postWithAuth } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { GallonForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';

const AddGallon = ({ alert, history, loading }) => {
    const [submitting, setSubmitting] = useState(false);

    const onSubmitHandler = (
        name,
        stock
    ) => {
        setSubmitting(true);
        postWithAuth(
            '/gallons',
            {
                name,
                stock
            },
            (success) => {
                setSubmitting(false);
                alert('Galon berhasil ditambahkan', 'success');
                history.push('/gallons/stocks/get');    
            },
            (error) => {
                setSubmitting(false);
                alert(`Telah terjadi kesalahan: ${error && error.message}`);
            }
        );
    };
    
    return (
        <Fragment>
            {!loading ? (
                <GallonForm submitting={submitting} history={history} onSubmit={onSubmitHandler} />
            ) : (
                <CustomSpinner loading={loading} type="page" />
            )}
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGallon);
