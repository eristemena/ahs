import React from 'react';
import { connect } from 'react-redux';
import { intlMessage } from '../language';

function NotFound({ language }) {
	const { not_found } = intlMessage(language);
	return (
		<div className="not-found">
			<h1>{not_found[0]}</h1>
			<h4>{not_found[1]}</h4>
			<small>{not_found[2]}</small>
		</div>
	);
}

const mapStateToProps = (state) => ({
	language: state.language,
});

export default connect(mapStateToProps)(NotFound);
