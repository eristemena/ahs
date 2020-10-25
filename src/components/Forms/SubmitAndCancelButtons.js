import React from 'react';
import CustomSpinner from '../CustomSpinner';
import { intlMessage } from '../../language';
import { connect } from 'react-redux';

const SubmitAndCancelButtons = ({
	submitting,
	loading1,
	loading2,
	history,
	action,
	language,
	cancel = () => history.goBack(),
}) => {
	const { button } = intlMessage(language);
	return (
		<div className="mt-3">
			<button
				className={`btn btn-primary submit-button mr-2 ${
					submitting || loading1 || loading2 ? 'disabled' : ''
				} ${
					loading1 || loading2
						? 'button-waiting-for-confirmation'
						: ''
				}`}
				type="submit"
				disabled={submitting || loading1 || loading2}>
				<CustomSpinner loading={submitting} type="button" />
				<span className={`${submitting ? 'd-none' : ''}`}>
					{action || button.submit}
				</span>
			</button>
			<button
				className="btn btn-secondary cancel-button"
				type="button"
				onClick={cancel}>
				{button.cancel}
			</button>
		</div>
	);
};

const mapStateToProps = (state) => ({
	language: state.language,
});

export default connect(mapStateToProps)(SubmitAndCancelButtons);
