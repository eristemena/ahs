import React, { useState, useEffect } from 'react';
import { getCustomers } from '../../redux/actions/customer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteModal from '../../components/DeleteModal';
import { setLoading } from '../../redux/actions/loading';
import { del } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { checkAdminMerchant } from '../../utilities';
import CustomSpinner from '../../components/CustomSpinner';
import {
    Container,
    Pagination,
    PaginationItem,
    PaginationLink,
    Card,
    CardBody,
} from 'reactstrap';

const GetCustomers = ({
    customer,
    loading,
    getCustomers,
    user,
    history,
    alert,
    setLoading,
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [delId, setDelId] = useState(-1);
    const [queryName, setQueryName] = useState('');

    useEffect(() => {
        getCustomers(page, queryName);
    }, [page]);

    useEffect(() => {
        if (loading) {
            setTotalPage(() => {
                let a = [];
                for (let i = 1; i <= (customer ? customer.totalPage : 1); i++) {
                    a.push(i);
                }
                return a;
            });
        }
    }, [customer]);

    const activeNav = (type) => {
        if (loading) {
            return true;
        }
        if (type === 'prev') {
            if (page === 1) {
                return true;
            }
        } else {
            if (!customer || customer.totalPage < 1) {
                return true;
            } else if (page === customer.totalPage) {
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
            `/customers/${delId}`,
            (success) => {
                alert('Berhasil menghapus data', 'success');
                getCustomers(page);
                setLoading(false);
                setDelId(-1);
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                getCustomers(page);
                setLoading(false);
                setDelId(-1);
            }
        );
    };

    const searchName = (e) => {
        e.preventDefault();

        getCustomers(1, queryName);
    };

    const inputOnChange = (e) => {
        if (e.target.value.length === 0) {
            getCustomers(page, '');
        } else {
            setQueryName(e.target.value);
        }
    };

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1>Customers</h1>
                <button
                    className={`btn btn-primary font-weight-bold table-button ${
                        !checkAdminMerchant(user) ? 'disabled' : ''
                    }`}
                    disabled={!checkAdminMerchant(user)}
                    onClick={() => history.push('/customers/add')}>
                    ADD CUSTOMER
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
                    <Card className="customer">
                        <CardBody>
                            <table className="customer-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        {checkAdminMerchant(user) ? (
                                            <th>Actions</th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        customer && customer.data.length > 0 ? (
                                            customer.data.map((custom) => (
                                                <tr
                                                    key={custom.id}
                                                    className="text-center">
                                                    <td>{custom.name}</td>
                                                    <td>
                                                        {' '}
                                                        {custom.email ||
                                                            '~'}{' '}
                                                    </td>
                                                    <td> {custom.phone} </td>
                                                    <td> {custom.address}</td>
                                                    {checkAdminMerchant(
                                                        user
                                                    ) ? (
                                                        <td className="text-center">
                                                            <Link
                                                                to={`/customers/edit?id=${custom.id}`}
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
                                                                        custom.id
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
                                                        ? 'Pelanggan tidak ditemukan'
                                                        : checkAdminMerchant(
                                                              user
                                                          )
                                                        ? 'Belum ada pelanggan, silahkan tambahkan pelanggan'
                                                        : 'Belum ada pelanggan'}
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
                </div>
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
                                    activePage(number) ? 'disabled active' : ''
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
            </Container>
            <DeleteModal
                deleteHandler={deleteHandler}
                additionalText="All transactions related to this customer will also be deleted."
            />
        </Container>
    );
};

const mapStateToProps = (state) => ({
    customer: state.customer,
    loading: state.loading,
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    getCustomers: (page, name) => dispatch(getCustomers(page, name)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetCustomers);
