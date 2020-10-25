import React, { useEffect, useState } from 'react';
import { addAlert, getProducts, setLoading } from '../../redux/actions';
import { connect } from 'react-redux';
import { formatPrice, checkAdminMerchant } from '../../utilities';
import {
	DeleteModal,
	TableSearchbar,
	CustomPagination,
	Table,
} from '../../components';
import { del } from '../../axios';
import { Container } from 'reactstrap';
import { intlMessage } from '../../language';

const GetProducts = ({
	history,
	alert,
	user,
	getProducts,
	product,
	loading,
	setLoading,
	language,
}) => {
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState([]);
	const [delId, setDelId] = useState(-1);
	const [queryName, setQueryName] = useState('');

	const [modalToggle, setModalToggle] = useState(false);

	useEffect(() => {
		getProducts(page, queryName);
	}, [page]);

	useEffect(() => {
		if (loading) {
			setTotalPage(() => {
				let a = [];
				for (let i = 1; i <= (product ? product.totalPage : 1); i++) {
					a.push(i);
				}
				return a;
			});
		}
	}, [product]);

	const activeNav = (type) => {
		if (loading) {
			return true;
		}
		if (type === 'prev') {
			if (page === 1) {
				return true;
			}
		} else {
			if (!product || product.totalPage < 1) {
				return true;
			} else if (page === product.totalPage) {
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
			return alert('Telah terjadi kesalahan.');
		}
		del(
			`/products/${delId}`,
			(success) => {
				alert('Berhasil menghapus data.', 'success');
				getProducts(page);
				setLoading(false);
				setDelId(-1);
			},
			(error) => {
				alert('Telah terjadi kesalahan.');
				getProducts(page);
				setLoading(false);
				setDelId(-1);
			}
		);
	};

	const searchName = (e) => {
		e.preventDefault();

		if (!/^\s*$/.test(queryName)) {
			getProducts(1, queryName);
		}
	};

	const inputOnChange = (e) => {
		if (e.target.value.length === 0) {
			getProducts(page, '');
		} else {
			setQueryName(e.target.value);
		}
	};

	const {
		products: {
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
					onClick={() => history.push('/products/add')}>
					{button}
				</button>
			</div>
			<TableSearchbar
				searchName={searchName}
				inputOnChange={inputOnChange}
			/>
			<Container fluid>
				<Table
					tableClassName="product"
					tableHead={[
						table.name,
						table.price,
						table.buying_price,
						table.group,
						checkAdminMerchant(user)
							? action.action
							: table.merchant,
					]}
					tableBody={
						product &&
						product.data &&
						product.data.map((item) => ({
							id: item.id,
							name: item.name,
							price: `Rp. ${formatPrice(item.price)}`,
							buying_price: `Rp. ${formatPrice(
								item.buying_price
							)}`,
							group: item.group_id ? item.group.name : '~',
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
							edit: '/products/edit',
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
				additionalText="All transactions related to this product will also be deleted."
			/>
		</Container>
	);
};

const mapDispatchToProps = (dispatch) => ({
	alert: (message, type) => dispatch(addAlert(message, type)),
	getProducts: (page, name) => dispatch(getProducts(page, name)),
	setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
	product: state.product,
	loading: state.loading,
	user: state.user,
	language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetProducts);
