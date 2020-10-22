import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { get } from '../../../axios';
import { intlMessage } from '../../../language';

const GallonStock = ({ gallon_stock, history, language }) => {
	const [total, setTotal] = useState(0);

	useEffect(() => {
		get(
			'/stocks/report',
			({ data }) => {
				setTotal(data.totalBorrowedGallons);
			},
			(error) => {
				history.push('/');
			}
		);
	}, []);

	const {
		borrowing: { stock },
	} = intlMessage(language);

	return (
		<Card>
			<CardBody className="text-center stocks-card">
				<p>{stock.stock}</p>
				<h3 className="text-success">
					{gallon_stock.data && gallon_stock.data.stock}
				</h3>
				<div className="dropdown-divider"></div>
				<p className="mt-3">{stock.borrowed}</p>
				<h3 className="text-success mb-0">{total}</h3>
			</CardBody>
		</Card>
	);
};

const mapStateToProps = (state) => ({
	gallon_stock: state.gallon_stock,
	language: state.language,
});

export default withRouter(connect(mapStateToProps)(GallonStock));
