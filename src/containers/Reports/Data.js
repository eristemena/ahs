import React, { useState, useEffect, Fragment } from 'react';
import {
	Row,
	Col,
	Card,
	CardBody,
	CardHeader,
	Container,
	Modal,
	ModalBody,
	InputGroup,
	InputGroupAddon,
} from 'reactstrap';
import moment from 'moment';
import { get } from '../../axios';
import { errorHandler } from '../../utilities';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { logout, addAlert } from '../../redux/actions';
import { CustomSpinner, Datepicker } from '../../components';

const Data = ({ history, logout, alert }) => {
	const [modal, setModal] = useState(false);
	const [date, setDate] = useState(new Date());
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const [windowWidth, setWindowWidth] = useState(undefined);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const load = () => {
		setLoading(true);
		get(
			`/transactions/report?date=${moment(date).format('YYYY-MM-DD')}`,
			({ data }) => {
				setData(data);
				setLoading(false);
			},
			(error) => {
				console.log(error);
				errorHandler(error, alert, logout);
				setLoading(false);
			}
		);
	};

	useEffect(() => {
		load();
	}, [date]);

	const card = (className = '', title, item) => (
		<Card
			className={className}
			style={{
				minWidth: 170,
			}}>
			<CardHeader>{title}</CardHeader>
			<CardBody
				className={`${
					item * 1 !== 0
						? item * 1 > 0
							? 'text-success'
							: 'text-danger'
						: ''
				} font-weight-bold`}
				style={{ fontSize: '1rem' }}>
				{item}
			</CardBody>
		</Card>
	);
	return (
		<Container fluid>
			{loading ? (
				<CustomSpinner type="page" loading={loading} />
			) : (
				<Fragment>
					<div className="d-md-flex justify-content-between mb-2">
						<h1 className="page-title">
							Data
							<h4 className="d-inline">
								({moment(date).format('D MMMM YYYY')})
							</h4>
						</h1>
						<button
							className="btn btn-primary font-weight-bold"
							type="button"
							onClick={() => setModal(!modal)}>
							FILTER BY DATE RANGE
						</button>
					</div>
					{data.map((item, index) => (
						<Fragment key={index}>
							<div className="dropdown-divider dark"></div>
							<Card>
								<CardBody>
									<div className="d-md-flex justify-content-between mb-2">
										<h3 className="page-title pb-3">
											{item.name}
										</h3>
									</div>
									{windowWidth > 576 ? (
										<Row className="mt-2">
											<Col xs="9">
												<PerfectScrollbar>
													<div className="d-flex flex-row flex-nowrap">
														{card(
															'mr-2',
															'Buy',
															item.buy
														)}
														{card(
															'mx-2',
															'Sell',
															item.sell
														)}
														{card(
															'mx-2',
															'Total Buy',
															item.qty_buy
														)}
														{card(
															'mx-2',
															'Total Sell',
															item.qty_sell
														)}
														{card(
															'ml-2',
															'Total',
															item.total
														)}
													</div>
												</PerfectScrollbar>
											</Col>
											<Col xs="3">
												{card(
													'ml-2',
													'Stock',
													item.stock
												)}

												<small>
													*Only shows stock until the
													selected date
												</small>
											</Col>
										</Row>
									) : (
										<Fragment>
											<PerfectScrollbar className="mt-2">
												<div className="d-flex flex-row flex-nowrap mt-2">
													{card(
														'mr-2',
														'Total Buy',
														item.buy
													)}
													{card(
														'mx-2',
														'Total Sell',
														item.sell
													)}
													{card(
														'mx-2',
														'Total Buy',
														item.qty_buy
													)}
													{card(
														'mx-2',
														'Total Sell',
														item.qty_sell
													)}
													{card(
														'mx-2',
														'Total',
														item.total
													)}
												</div>
											</PerfectScrollbar>
											<small>
												*Only shows stock until the
												selected date
											</small>
										</Fragment>
									)}
								</CardBody>
							</Card>
						</Fragment>
					))}
				</Fragment>
			)}
			<Modal
				isOpen={modal}
				toggle={() => setModal(!modal)}
				className="modal-right">
				<ModalBody>
					<p>Select Date:</p>
					<InputGroup>
						<Datepicker
							onChange={(e) => {
								setDate(e);
								setModal(false);
							}}
							value={date}
						/>
					</InputGroup>
				</ModalBody>
			</Modal>
		</Container>
	);
};

const mapDispatchToProps = (dispatch) => ({
	logout: () => dispatch(logout()),
	alert: (message) => dispatch(addAlert(message)),
});

export default withRouter(connect(null, mapDispatchToProps)(Data));
