import React, { useState, Fragment, useEffect } from 'react';
import { put, get } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { GallonForm } from '../../components/Forms';
import { connect } from 'react-redux';
import CustomSpinner from '../../components/CustomSpinner';
import { checkAdminMerchant } from '../../utilities';
import { setLoading } from '../../redux/actions/loading';

const EditGallon = ({ alert, user, loading, history, setLoading }) => {
    const [submitting, setSubmitting] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        setLoading(true);
        if (!checkAdminMerchant(user)) {
            alert('Login sebagai admin merchant untuk menambahkan produk');
            history.goBack();
        }

        const search = history.location.search;

        if (!search.length > 0) {
            history.goBack();
            return alert('Telah terjadi kesalahan');
        }

        if (!search.includes('id')) {
            history.goBack();
            return alert('Telah terjadi kesalahan');
        }

        const queryId = search.replace('?id=', '');

        if (isNaN(queryId)) {
            history.goBack();
            return alert('Telah terjadi kesalahan');
        }

        setId(queryId);
        get(
            `/gallons?id=${queryId}`,
            ({ data }) => {
                setLoading(false);
                const gallon = data[0];
                setName(gallon.name);
                setStock(gallon.stock);
            },
            (error) => {
                setLoading(false);
                history.goBack();
                alert(`Telah terjadi kesalahan: ${error && error.message}`);
            }
        );
    }, []);

    const onSubmitHandler = (name, stock) => {
        setSubmitting(true);
        put(
            `/gallons/${id}`,
            {
                name,
                stock,
            },
            (success) => {
                setSubmitting(false);
                alert('Galon berhasil diedit', 'success');
                history.goBack();
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
                <GallonForm
                    submitting={submitting}
                    history={history}
                    onSubmit={onSubmitHandler}
                    action="Edit"
                    stateName={name}
                    stateStock={stock}
                />
            ) : (
                <CustomSpinner loading={loading} type="page" />
            )}
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGallon);
