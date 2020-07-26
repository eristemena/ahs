import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

function Alerts({ alerts }) {
    return (
        <Fragment>
            {alerts.length > 0 ? (
                <Fragment>
                    {alerts.map((alert) => (
                        <Alert color={alert.type} key={alert.id} fade={false} className="notification-alert"> 
                            {alert.message}
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

const mapStateToProps = (state) => {
    return {
        alerts: state.alert,
    };
};

export default connect(mapStateToProps)(Alerts);
