import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { deleteAlert } from '../redux/actions';

function Alerts({ alerts, deleteAlert }) {
    return (
        <Fragment>
            {alerts.length > 0 ? (
                <Fragment>
                    {alerts.map((alert) => (
                        <Alert
                            color={alert.type}
                            key={alert.id}
                            fade={false}
                            className="notification-alert">
                            {alert.message}
                            <i
                                class="fas fa-times notification-close-icon"
                                title="Close"
                                onClick={() => deleteAlert(alert.id)}></i>
                        </Alert>
                    ))}
                </Fragment>
            ) : null}
        </Fragment>
    );
}

Alerts.propTypes = {
    alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
});

const mapDispatchToProps = (dispatch) => ({
    deleteAlert: (id) => dispatch(deleteAlert(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
