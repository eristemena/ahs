import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const CustomSpinner = ({ loading, type, menu, className = '' }) => {
	switch (type) {
		case 'page':
			return (
				<div
					className={`custom-spinner page-loading-spinner ${
						!loading ? 'd-none' : ''
					} ${menu ? 'menu-open' : 'menu-close'} ${className}`}
				/>
			);
		case 'table':
			return (
				<div
					className={`custom-spinner table-loading-spinner ${
						!loading ? 'd-none' : ''
					} ${className}`}
				/>
			);
		case 'button':
			return (
				<div
					className={`custom-spinner button-loading-spinner ${
						!loading ? 'd-none' : ''
					} ${className}`}
				/>
			);
		case 'card':
			return (
				<div
					className={`custom-spinner card-loading-spinner ${
						!loading ? 'd-none' : ''
					}`}
				/>
			);
		default:
			return null;
	}
};

CustomSpinner.propTypes = {
	loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	menu: state.menu,
});

export default connect(mapStateToProps)(CustomSpinner);
