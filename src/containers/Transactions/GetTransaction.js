import React, { useEffect, useState } from 'react';
import {
	addAlert,
	setLoading,
	getTransactions,
	logout,
} from '../../redux/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/id';
import { del, get } from '../../axios';
import {
	formatPrice,
	checkAdminMerchant,
	parseType,
	errorHandler,
} from '../../utilities';
import {
	DeleteModal,
	CustomPagination,
	Table,
	Datepicker,
	FilterComponent,
} from '../../components';
import Select from 'react-select';
import { Container, Collapse, Row, Col } from 'reactstrap';
import { intlMessage } from '../../language';

const GetTransaction = ({
	alert,
	getTransaction,
	transaction,
	history,
	user,
	loading,
	setLoading,
	language,
}) => {
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState([]);
	const [delId, setDelId] = useState(-1);
	const [sortBy, setSortBy] = useState('updated_at');
	const [dateSearch, setDateSearch] = useState(null);
	const [typeSearch, setTypeSearch] = useState(null);
	const [limit, setLimit] = useState(8);
	const [productSearch, setProductSearch] = useState(null);
	const [groupSearch, setGroupSearch] = useState(null);
	const [customerSearch, setCustomerSearch] = useState(null);

	const [modalToggle, setModalToggle] = useState(false);

	const [filter, setFilter] = useState(false);

	useEffect(() => {
		if (!dateSearch && !limit) {
			setLimit(8);
		}
		getTransaction(
			page,
			sortBy,
			dateSearch && moment(dateSearch).format('YYYY-MM-DD'),
			limit,
			typeSearch,
			productSearch && productSearch.value,
			groupSearch && groupSearch.value,
			customerSearch && customerSearch.value
		);
	}, [
		page,
		sortBy,
		dateSearch,
		limit,
		typeSearch,
		productSearch,
		groupSearch,
		customerSearch,
	]);

	useEffect(() => {
		if (loading) {
			setTotalPage(() => {
				let a = [];
				for (
					let i = 1;
					i <= (transaction ? transaction.totalPage : 1);
					i++
				) {
					a.push(i);
				}
				return a;
			});
		}
	}, [transaction]);

	const [productOption, setProductOption] = useState([]);
	const [productOptionLoading, setProductOptionLoading] = useState(false);
	const [groupOption, setGroupOption] = useState([]);
	const [groupOptionLoading, setGroupOptionLoading] = useState(false);
	const [customerOption, setCustomerOption] = useState([]);
	const [customerOptionLoading, setCustomerOptionLoading] = useState(false);

	useEffect(() => {
		setProductOptionLoading(true);
		setGroupOptionLoading(true);
		setCustomerOptionLoading(true);
		get(
			'/products',
			({ data }) => {
				if (data.length > 0) {
					setProductOption(
						data.map(({ id, name }) => ({ value: id, label: name }))
					);
				}
				setProductOptionLoading(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setProductOptionLoading(false);
			}
		);
		get(
			'/customers',
			({ data }) => {
				if (data.length > 0) {
					setCustomerOption(
						data.map(({ id, name }) => ({ value: id, label: name }))
					);
				}
				setCustomerOptionLoading(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setCustomerOptionLoading(false);
			}
		);
		get(
			'/products_groups',
			({ data }) => {
				if (data.length > 0) {
					setGroupOption(
						data.map(({ id, name }) => ({ value: id, label: name }))
					);
				}
				setGroupOptionLoading(false);
			},
			(error) => {
				errorHandler(error, alert, logout);
				setGroupOptionLoading(false);
			}
		);
	}, []);

	const activeNav = (type) => {
		if (loading) {
			return true;
		}
		if (type === 'prev') {
			if (page === 1) {
				return true;
			}
		} else {
			if (!transaction || transaction.totalPage < 1) {
				return true;
			} else if (page === transaction.totalPage) {
				return true;
			}
		}
	};

	const activePage = (p) => {
		if (loading) {
			return true;
		}
		if (p === page) {
			return true;
		} else {
			return false;
		}
	};

	const deleteData = () => {
		setLoading(true);
		if (delId < 0) {
			setLoading(false);
			return alert('Telah terjadi kesalahan');
		}
		del(
			`/transactions/${delId}`,
			(success) => {
				alert('Data berhasil dihapus', 'success');
				getTransaction(
					page,
					sortBy,
					dateSearch ? moment(dateSearch).format('YYYY-MM-DD') : null,
					limit
				);
				setLoading(false);
				setDelId(-1);
			},
			(error) => {
				alert('Telah terjadi kesalahan');
				getTransaction(
					page,
					sortBy,
					dateSearch ? moment(dateSearch).format('YYYY-MM-DD') : null,
					limit
				);
				setLoading(false);
				setDelId(-1);
			}
		);
	};

	const {
		transactions: {
			get: { title, button, table },
		},
		action,
	} = intlMessage(language);

	const customSelect = (options, loading, onChange, value) => (
		<Select
			classNamePrefix="custom-searchable-select filter "
			value={value}
			options={options}
			maxMenuHeight={110}
			onChange={onChange}
			isDisabled={loading}
			isLoading={loading}
		/>
	);

	return (
		<Container fluid>
			<div className="d-sm-flex flex-column flex-sm-row justify-content-between align-middle mb-2">
				<h1 className="page-title">{title}</h1>
				<button
					className={`btn btn-primary font-weight-bold table-button ${
						!checkAdminMerchant(user) ? 'disabled' : ''
					}`}
					disabled={!checkAdminMerchant(user)}
					onClick={() => history.push('/transactions/add')}>
					{button}
				</button>
			</div>
			<button
				className={`btn btn-primary sorting-button mb-2 d-flex justify-content-center justify-content-md-between ${
					filter && 'open'
				}`}
				onClick={() => setFilter(!filter)}>
				<span>Filter</span>
				<i className="fas fa-chevron-down arrow ml-2"></i>
			</button>
			<div className="dropdown-divider dark"></div>
			<Collapse isOpen={filter}>
				<Row>
					<Col xs="12" md="6">
						<FilterComponent
							text="Order by:"
							dropdown={{
								selected:
									sortBy === 'date' ? 'Date' : 'Modified At',
								items: [
									{
										text: 'Date',
										value: 'date',
									},
									{
										text: 'Modified At',
										value: 'updated_at',
									},
								],
							}}
							onDropdownItemClick={setSortBy}
						/>
						<FilterComponent text="Select date:">
							<Datepicker
								value={dateSearch}
								wrapperClassname="transaction-table-datepicker ml-0"
								isClearable
								onChange={(e) => {
									setDateSearch(e);
									setPage(1);
									// setFilter(!filter);
								}}
								placeholder="Pilih hari"
							/>
						</FilterComponent>
						<FilterComponent
							text="Type:"
							dropdown={{
								selected: typeSearch
									? parseType(typeSearch, language)
									: '-',
								items: [
									{
										text: '-',
										value: null,
									},
									{
										text: parseType('buy', language),
										value: 'buy',
									},
									{
										text: parseType('sell', language),
										value: 'sell',
									},
								],
							}}
							onDropdownItemClick={setTypeSearch}
						/>
						<FilterComponent
							text="Limit:"
							dropdown={{
								selected: limit || 'All',
								items: [4, 8, 12, 20, null].map((number) => ({
									text: number || 'All',
									value: number,
								})),
							}}
							onDropdownItemClick={(value) => {
								if (!dateSearch && !value) {
									alert('Pilih tanggal');
								} else {
									setLimit(value);
								}
							}}
						/>
					</Col>
					<Col xs="12" md="6">
						<FilterComponent text="Product:">
							{customSelect(
								productOption,
								productOptionLoading,
								(item) => {
									if (groupSearch !== null) {
										setGroupSearch(null);
									}
									setProductSearch(item);
								},
								productSearch
							)}
							{productSearch && (
								<button
									onClick={() => setProductSearch(null)}
									className="btn btn-danger sorting-button ml-2">
									Cancel
								</button>
							)}
						</FilterComponent>
						<FilterComponent text="Group:">
							{customSelect(
								groupOption,
								groupOptionLoading,
								(item) => {
									if (productSearch !== null) {
										setProductSearch(null);
									}
									setGroupSearch(item);
								},
								groupSearch
							)}
							{groupSearch && (
								<button
									onClick={() => setGroupSearch(null)}
									className="btn btn-danger sorting-button ml-2">
									Cancel
								</button>
							)}
						</FilterComponent>
						<FilterComponent text="Customer:">
							{customSelect(
								customerOption,
								customerOptionLoading,
								(item) => setCustomerSearch(item),
								customerSearch
							)}
							{customerSearch && (
								<button
									onClick={() => setCustomerSearch(null)}
									className="btn btn-danger sorting-button ml-2">
									Cancel
								</button>
							)}
						</FilterComponent>
					</Col>
				</Row>
			</Collapse>
			<Container fluid>
				<Table
					tableClassName="transaction"
					tableHead={[
						table.date,
						table.name,
						table.type,
						table.quantity,
						table.price,
						table.customer,
						checkAdminMerchant(user) ? action.action : null,
					]}
					tableBody={
						transaction &&
						transaction.data &&
						transaction.data.map((item) => ({
							id: item.id,
							date: moment(item.date).format('LL'),
							name: item.product.name,
							type: parseType(item.type, language),
							quantity: item.quantity,
							price: `Rp. ${formatPrice(
								item.type === 'sell'
									? item.price
									: item.buying_price
							)}`,
							customer: item.customer ? item.customer.name : '~',
							info: item.info,
						}))
					}
					deleteId
					loading={loading}
					deleteFunction={setDelId}
					setModal={setModalToggle}
					actions={
						checkAdminMerchant(user) && {
							edit: '/transactions/edit',
							info: true,
						}
					}
					noDataMessage={table.no_data}
				/>
				<CustomPagination
					currentPage={page}
					pages={totalPage}
					activePage={activePage}
					setPage={setPage}
					activeNav={activeNav}
				/>
			</Container>
			<DeleteModal
				toggle={modalToggle}
				setToggle={setModalToggle}
				deleteHandler={deleteData}
			/>
		</Container>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	getTransaction: (
		page,
		sort,
		date,
		limit,
		type,
		product_id,
		group_id,
		customer_id
	) =>
		dispatch(
			getTransactions(
				page,
				sort,
				date,
				limit,
				type,
				product_id,
				group_id,
				customer_id
			)
		),
	setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
	transaction: state.transaction,
	user: state.user,
	loading: state.loading,
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetTransaction);
