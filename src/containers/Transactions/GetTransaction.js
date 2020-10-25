import React, { useEffect, useState } from 'react';
import { addAlert, setLoading, getTransactions } from '../../redux/actions';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/id';
import { del } from '../../axios';
import { formatPrice, checkAdminMerchant, parseType } from '../../utilities';
import {
	DeleteModal,
	CustomPagination,
	Table,
	Datepicker,
	FilterComponent,
} from '../../components';
import { Container, Collapse } from 'reactstrap';
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
	const [limit, setLimit] = useState(8);

	const [modalToggle, setModalToggle] = useState(false);

	const [filter, setFilter] = useState(false);

	useEffect(() => {
		getTransaction(
			page,
			sortBy,
			dateSearch ? moment(dateSearch).format('YYYY-MM-DD') : null,
			limit
		);
	}, [page, sortBy, dateSearch, limit]);

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
				className={`btn btn-primary sorting-button mb-2 d-flex justify-content-center justify-content-md-between sorting-button ${
					filter && 'open'
				}`}
				onClick={() => setFilter(!filter)}>
				<span>Filter</span>
				<i className="fas fa-chevron-down arrow ml-2"></i>
			</button>
			<div className="dropdown-divider dark"></div>
			<Collapse isOpen={filter}>
				<FilterComponent
					text="Order by:"
					dropdown={{
						selected: sortBy === 'date' ? 'Date' : 'Modified At',
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
					text="Limit:"
					dropdown={{
						selected: limit,
						items: [4, 8, 12, 20].map((number) => ({
							text: number,
							value: number,
						})),
					}}
					onDropdownItemClick={setLimit}
				/>
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
	getTransaction: (page, sort, date, limit) =>
		dispatch(getTransactions(page, sort, date, limit)),
	setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
	transaction: state.transaction,
	user: state.user,
	loading: state.loading,
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetTransaction);
