import React from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import moment from 'moment';
import 'moment/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('id', id);

const Datepicker = ({
	className = '',
	wrapperClassname = '',
	value,
	onChange = () => {},
	minDate,
	placeholder,
	showMonthDropdown = false,
	isClearable = false,
}) => {
	return (
		<ReactDatePicker
			locale="id"
			selected={value}
			dateFormat="dd MMMM yyyy"
			className={`form-control ${className}`}
			wrapperClassName={wrapperClassname}
			todayButton={`Hari ini (${moment(new Date()).format('D MMMM')})`}
			showMonthDropdown={showMonthDropdown}
			disabledKeyboardNavigation
			placeholderText={placeholder}
			onChange={onChange}
			minDate={minDate}
			maxDate={new Date()}
			popperPlacement="bottom"
			isClearable={isClearable}
			popperModifiers={{
				flip: {
					enabled: false,
				},
			}}
		/>
	);
};

Datepicker.propTypes = {};

export default Datepicker;
