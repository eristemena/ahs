import React from 'react';
import PropTypes from 'prop-types';

const CustomSpinner = ({loading, type}) => {
    switch (type) {
        case 'page':
            return (
                <div className={`custom-spinner page-loading-spinner ${!loading ? 'd-none' : ''}`}></div>
            )
        case 'table':
            return (
                <div className={`custom-spinner table-loading-spinner ${!loading ? 'd-none' : ''}`}></div>
            )
        case 'button':
            return (
                <div className={`custom-spinner button-loading-spinner ${!loading ? 'd-none' : ''}`}></div>
            )
        default:
            break;
    }
};

CustomSpinner.propTypes = {
    loading: PropTypes.bool.isRequired,
};

export default CustomSpinner;
