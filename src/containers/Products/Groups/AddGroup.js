import React, { useState } from 'react';
import { GroupForm } from '../../../components/Forms';
import { postWithAuth } from '../../../axios';
import { connect } from 'react-redux';
import { addAlert } from '../../../redux/actions/';

const AddGroup = ({ history, alert }) => {
    const [submitting, setSubmitting] = useState(false);

    const submitHandler = (name, quantity) => {
        setSubmitting(true);
        postWithAuth(
            '/products_groups',
            {
                name,
                quantity,
            },
            (success) => {
                alert('Grup berhasil ditambahkan', 'success');
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
        <GroupForm
            submitting={submitting}
            history={history}
            onSubmit={submitHandler}
        />
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
});

export default connect(null, mapDispatchToProps)(AddGroup);
