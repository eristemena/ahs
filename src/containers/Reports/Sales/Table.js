import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { formatPrice, parseType } from '../../../utilities';
import moment from 'moment';
import 'moment/locale/id';

const Table = ({
	loading,
	temp,
	refreshFunc = () => {},
	data = [],
	date,
	setDate = () => {},
	translated,
	language,
}) => {
	return (
		<div className="custom-table">
			<Card className="sales">
				<div className="custom-button">
					<button
						className={`refresh-button ${loading ? 'spin' : ''}`}
						disabled={loading}
						title="Refresh"
						onClick={() => refreshFunc(!temp)}>
						<i className="simple-icon-refresh" />
					</button>
				</div>
				<CardTitle className="p-3 m-0">
					<h4 className="m-0">{translated.title}</h4>
				</CardTitle>
				<CardBody className="pt-0">
					<PerfectScrollbar
						options={{
							suppressScrollX: true,
							wheelPropagation: true,
							wheelSpeed: 0.2,
						}}>
						<table className="sales-table">
							<thead>
								<tr className="text-center">
									<th>Date</th>
									<th>{translated.thead.name}</th>
									<th>{translated.thead.type}</th>
									<th>{translated.thead.quantity}</th>
									<th>{translated.thead.price}</th>
									<th>{translated.thead.total}</th>
								</tr>
							</thead>
							<tbody>
								{data.length > 0 ? (
									data.map((item, index) => (
										<tr className="text-center" key={index}>
											<td>
												{moment(item.date).format(
													'D MMM YYYY'
												)}
											</td>
											<td>{item.product.name}</td>
											<td>
												{parseType(item.type, language)}
											</td>
											<td>{item.quantity}</td>
											<td>
												Rp.{' '}
												{item.type === 'buy'
													? formatPrice(
															item.buying_price
													  )
													: formatPrice(item.price)}
											</td>
											<td
												className={`text-${
													item.type === 'buy'
														? 'danger'
														: 'success'
												} font-weight-bold`}>
												{item.type === 'buy'
													? `- Rp. ${formatPrice(
															item.buying_price *
																item.quantity
													  )}`
													: `+ Rp. ${formatPrice(
															item.price *
																item.quantity
													  )}`}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="6"
											className="text-center position-relative">
											{translated.no_data[0]}{' '}
											<Link
												to="/transactions/add"
												className="stretched-link">
												{translated.no_data[1]}
											</Link>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</PerfectScrollbar>
				</CardBody>
			</Card>
		</div>
	);
};

Table.propTypes = {
	loading: PropTypes.bool.isRequired,
	temp: PropTypes.bool.isRequired,
	refreshFunc: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired,
};

export default Table;
