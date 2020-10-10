import React, { useState, useEffect, Fragment } from 'react';
import { GroupForm } from '../../../components/Forms';
import { put, get } from '../../../axios';
import { connect } from 'react-redux';
import { addAlert, setLoading } from '../../../redux/actions/';
import { CustomSpinner } from '../../../components';
import { checkAdminMerchant } from '../../../utilities';

const EditGroup = ({ history, alert, loading, setLoading, user }) => {
    const [submitting, setSubmitting] = useState(false);
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [quantity, setQuantity] = useState(null);

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
            `/products_groups?id=${queryId}`,
            ({ data }) => {
                const group = data[0];
                setName(group.name);
                setQuantity(group.quantity);
                setLoading(false);
            },
            (error) => {
                alert(
                    `Telah terjadi kesalahan${
                        error ? `: ${error.message}` : ''
                    }.`
                );
                setLoading(false);
                history.goBack();
            }
        );
    }, []);

    const submitHandler = (name, quantity) => {
        setSubmitting(true);
        put(
            `/products_groups/${id}`,
            {
                name,
                quantity,
            },
            (success) => {
                alert('Grup berhasil diedit', 'success');
                history.push('/products/groups/get');
                setSubmitting(false);
            },
            (error) => {
                alert(
                    `Telah terjadi kesalahan${
                        error ? `: ${error.message}` : ''
                    }.`
                );
                setSubmitting(false);
            }
        );
    };

    return (
        <Fragment>
            {!loading ? (
                <GroupForm
                    onSubmit={submitHandler}
                    edit={true}
                    submitting={submitting}
                    stateName={name}
                    stateQuantity={quantity}
                    history={history}
                    action="Edit"
                />
            ) : (
                <CustomSpinner type="page" loading={loading} />
            )}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    loading: state.loading,
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
