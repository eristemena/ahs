import React, { useEffect, useState } from 'react';
import {
	addAlert,
	setLoading,
	getGroups,
	logout,
} from '../../../redux/actions';
import { connect } from 'react-redux';
import { checkAdminMerchant, errorHandler } from '../../../utilities';
import {
	DeleteModal,
	TableSearchbar,
	CustomPagination,
	Table,
	FilterComponent,
} from '../../../components';
import { del } from '../../../axios';
import {
	Container,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Collapse,
} from 'reactstrap';
import { intlMessage } from '../../../language';

const GetGroups = ({
	history,
	alert,
	user,
	group,
	loading,
	getGroups,
	setLoading,
	language,
	logout,
}) => {
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState([]);
	const [delId, setDelId] = useState(-1);
	const [queryName, setQueryName] = useState('');
	const [sortBy, setSortBy] = useState('updated_at');
	const [limit, setLimit] = useState(8);

	const [modalToggle, setModalToggle] = useState(false);

	const [filter, setFilter] = useState(false);

	useEffect(() => {
		getGroups(page, sortBy, queryName, limit);
	}, [page, sortBy, limit]);

	useEffect(() => {
		if (loading) {
			setTotalPage(() => {
				let a = [];
				for (let i = 1; i <= (group ? group.totalPage : 1); i++) {
					a.push(i);
				}
				return a;
			});
		}
	}, [group]);

	const activeNav = (type) => {
		if (loading) {
			return true;
		}
		if (type === 'prev') {
			if (page === 1) {
				return true;
			}
		} else {
			if (!group || group.totalPage < 1) {
				return true;
			} else if (page === group.totalPage) {
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

	const deleteHandler = () => {
		setLoading(true);
		if (delId < 0) {
			setLoading(false);
			return alert('Telah terjadi kesalahan');
		}
		del(
			`/products_groups/${delId}`,
			() => {
				alert('Berhasil menghapus data', 'success');
				getGroups(page, sortBy, queryName, limit);
				setLoading(false);
				setDelId(-1);
			},
			(error) => {
				errorHandler(error, alert, logout);
				getGroups(page, sortBy, queryName, limit);
				setLoading(false);
				setDelId(-1);
			}
		);
	};

	const searchName = (e) => {
		e.preventDefault();

		if (!/^\s*$/.test(queryName)) {
			getGroups(1, sortBy, queryName, limit);
		}
	};

	const inputOnChange = (e) => {
		if (e.target.value.length === 0) {
			getGroups(page, sortBy, '', limit);
		} else {
			setQueryName(e.target.value);
		}
	};

	const orderDropdown = (text, order) => (
		<DropdownItem
			onClick={() => {
				setSortBy(order);
				// setFilter(!filter);
			}}>
			{text}
		</DropdownItem>
	);

	const {
		groups: {
			get: { title, button, table },
		},
		action,
	} = intlMessage(language);

	return (
		<Container fluid>
			<div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
				<h1 className="page-title">{title}</h1>
				<button
					className={`btn btn-primary font-weight-bold table-button ${
						!checkAdminMerchant(user) ? 'disabled' : ''
					}`}
					disabled={!checkAdminMerchant(user)}
					onClick={() => history.push('/products/groups/add')}>
					{button}
				</button>
			</div>
			<button
				className="btn btn-primary sorting-button mb-2 d-flex justify-content-center justify-content-md-between sorting-button"
				onClick={() => setFilter(!filter)}>
				<span>Filter</span>
				<i className="fas fa-chevron-down arrow ml-2"></i>
			</button>
			<div className="dropdown-divider dark"></div>
			<Collapse isOpen={filter}>
				<FilterComponent
					text="Order by:"
					dropdown={{
						selected:
							sortBy === 'created_at'
								? 'Created At'
								: 'Modified At',
						items: [
							{
								text: 'Created At',
								value: 'created_at',
							},
							{
								text: 'Modified At',
								value: 'updated_at',
							},
						],
					}}
					onDropdownItemClick={setSortBy}
				/>
				<FilterComponent text="Search by name:">
					<TableSearchbar
						searchName={searchName}
						inputOnChange={inputOnChange}
						className="my-auto"
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
					tableClassName="group"
					tableHead={[
						table.name,
						table.quantity,
						checkAdminMerchant(user)
							? action.action
							: table.merchant,
					]}
					tableBody={
						group &&
						group.data &&
						group.data.map((item) => ({
							id: item.id,
							name: item.name,
							quantity: item.quantity,
							merchant_action: !checkAdminMerchant(user)
								? item.owner.name
								: null,
						}))
					}
					deleteId
					loading={loading}
					deleteFunction={setDelId}
					setModal={setModalToggle}
					actions={
						checkAdminMerchant(user) && {
							edit: '/products/groups/edit',
						}
					}
					noDataMessage={table.no_data}
				/>
				<CustomPagination
					pages={totalPage}
					currentPage={page}
					activeNav={activeNav}
					activePage={activePage}
					setPage={setPage}
				/>
			</Container>
			<DeleteModal
				deleteHandler={deleteHandler}
				toggle={modalToggle}
				setToggle={setModalToggle}
			/>
		</Container>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	getGroups: (page, sort, name, limit) =>
		dispatch(getGroups(page, sort, name, limit)),
	setLoading: (loading) => dispatch(setLoading(loading)),
	logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
	group: state.group,
	loading: state.loading,
	user: state.user,
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetGroups);
