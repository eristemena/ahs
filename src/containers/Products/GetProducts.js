import React, { useEffect, useState } from 'react';
import { addAlert } from '../../redux/actions/alert';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProducts } from '../../redux/actions/product';
import { formatPrice } from '../../utilities';
import { checkAdminMerchant } from '../../utilities';
import { setLoading } from '../../redux/actions/loading';
import DeleteModal from '../../components/DeleteModal';
import { del } from '../../axios';
import CustomSpinner from '../../components/CustomSpinner';
import {
    Container,
    Pagination,
    PaginationItem,
    PaginationLink,
    Card,
    CardBody,
} from 'reactstrap';

const GetProducts = ({
    history,
    alert,
    user,
    getProducts,
    product,
    loading,
    setLoading,
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [delId, setDelId] = useState(-1);
    const [queryName, setQueryName] = useState('');

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
            return alert('Telah terjadi kesalahan');
        }
        del(
            `/products/${delId}`,
            (success) => {
                alert('Berhasil menghapus data', 'success');
                getProducts(page);
                setLoading(false);
                setDelId(-1);
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                getProducts(page);
                setLoading(false);
                setDelId(-1);
            }
        );
    };

    const searchName = (e) => {
        e.preventDefault();

        getProducts(1, queryName);
    };

    const inputOnChange = (e) => {
        if (e.target.value.length === 0) {
            getProducts(page, '');
        } else {
            setQueryName(e.target.value);
        }
    };

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1>Products</h1>
                <button
                    className={`btn btn-primary font-weight-bold table-button ${!checkAdminMerchant(user) ? 'disabled' : ''}`}
                    disabled={!checkAdminMerchant(user)}
                    onClick={() => history.push('/products/add')}>
                    ADD PRODUCT
                </button>
            </div>
            <div className="custom-table-searchbar mb-3">
                <form onSubmit={searchName}>
                    <input
                        type="text"
                        className="d-inline"
                        onChange={inputOnChange}
                        placeholder="Search"
                    />
                    <i
                        className="simple-icon-magnifier"
                        onClick={searchName}></i>
                </form>
            </div>
            <Container fluid>
                <div className="custom-table">
                    <Card className="product">
                        <CardBody>
                            <table className="product-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>ID</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Buying Price</th>
                                        {user.merchant_id === null ? (
                                            <th>Merchant</th>
                                        ) : null}
                                        {checkAdminMerchant(user) ? (
                                            <th>Actions</th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        product &&
                                        product.data &&
                                        product.data.length > 0 ? (
                                            product.data.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="text-center">
                                                    <td>{product.id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{`Rp. ${formatPrice(
                                                        product.price
                                                    )}`}</td>
                                                    <td>{`Rp. ${formatPrice(
                                                        product.buying_price
                                                    )}`}</td>
                                                    {user.merchant_id ===
                                                    null ? (
                                                        <td>
                                                            {' '}
                                                            {
                                                                product.owner
                                                                    .name
                                                            }{' '}
                                                        </td>
                                                    ) : null}
                                                    {checkAdminMerchant(
                                                        user
                                                    ) ? (
                                                        <td>
                                                            <Link
                                                                to={`/products/edit?id=${product.id}`}
                                                                className="mr-2">
                                                                <i
                                                                    className="simple-icon-note edit-icon"
                                                                    title="Edit"></i>
                                                            </Link>
                                                            <i
                                                                className="simple-icon-close delete-icon"
                                                                data-toggle="modal"
                                                                data-target="#modal"
                                                                title="Delete"
                                                                onClick={(e) =>
                                                                    setDelId(
                                                                        product.id
                                                                    )
                                                                }></i>
                                                        </td>
                                                    ) : null}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        checkAdminMerchant(user)
                                                            ? 5
                                                            : user.merchant_id ===
                                                              null
                                                            ? 5
                                                            : 4
                                                    }
                                                    className="text-center">
                                                    {queryName.length > 0
                                                        ? 'Produk tidak ditemukan'
                                                        : checkAdminMerchant(
                                                              user
                                                          )
                                                        ? 'Belum ada produk, silahkan tambahkan produk'
                                                        : 'Belum ada produk'}
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={
                                                    checkAdminMerchant(user)
                                                        ? 5
                                                        : user.merchant_id ===
                                                          null
                                                        ? 5
                                                        : 4
                                                }
                                                className="text-center">
                                                <CustomSpinner
                                                    loading={loading}
                                                    type="table"
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                    <div className="text-center mt-2">
                        <Pagination
                            className="d-inline-block"
                            size="sm"
                            listClassName="justify-content-center">
                            <PaginationItem
                                className={`previous-page ${
                                    activeNav('prev') ? 'disabled' : ''
                                }`}>
                                <PaginationLink
                                    disabled={activeNav('prev')}
                                    onClick={() => setPage(page - 1)}>
                                    <i className="simple-icon-arrow-left" />
                                </PaginationLink>
                            </PaginationItem>
                            {totalPage.map((number) => (
                                <PaginationItem
                                    className={`goto-page ${
                                        activePage(number)
                                            ? 'disabled active'
                                            : ''
                                    }`}
                                    key={number}>
                                    <PaginationLink
                                        disabled={activePage(number)}
                                        onClick={() => setPage(number)}>
                                        {number}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem
                                className={`next-page ${
                                    activeNav('next') ? 'disabled' : ''
                                }`}>
                                <PaginationLink
                                    disabled={activeNav('next')}
                                    onClick={() => setPage(page + 1)}>
                                    <i className="simple-icon-arrow-right" />
                                </PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </div>
                </div>
            </Container>
            <DeleteModal
                deleteHandler={deleteHandler}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(GetProducts);
