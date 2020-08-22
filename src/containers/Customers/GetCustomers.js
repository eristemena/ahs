import React, { useState, useEffect } from 'react';
import { getCustomers } from '../../redux/actions/customer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    DeleteModal,
    TableSearchbar,
    CustomPagination,
} from '../../components/';
import { setLoading } from '../../redux/actions/loading';
import { del } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { checkAdminMerchant } from '../../utilities';
import CustomSpinner from '../../components/CustomSpinner';
import { Container, Card, CardBody,  } from 'reactstrap';
import { intlMessage } from '../../language';

const GetCustomers = ({
    customer,
    loading,
    getCustomers,
    user,
    history,
    alert,
    setLoading,
    language,
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

    const {
        customers: {
            get: { title, add_transaction, table },
        },
        action,
    } = intlMessage(language);

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1>{title}</h1>
                <button
                    className={`btn btn-primary font-weight-bold table-button ${
                        !checkAdminMerchant(user) ? 'disabled' : ''
                    }`}
                    disabled={!checkAdminMerchant(user)}
                    onClick={() => history.push('/customers/add')}>
                    {add_transaction}
                </button>
            </div>
            <div className="d-flex flex-column flex-md-row">
                <TableSearchbar
                    searchName={searchName}
                    inputOnChange={inputOnChange}
                />
                
            </div>
            <Container fluid>
                <div className="custom-table">
                    <Card className="customer">
                        <CardBody>
                            <table className="customer-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>{table.name}</th>
                                        <th>{table.email}</th>
                                        <th>{table.phone}</th>
                                        <th>{table.address}</th>
                                        {checkAdminMerchant(user) ? (
                                            <th>{action.action}</th>
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
                                                                    title={
                                                                        action.edit
                                                                    }></i>
                                                            </Link>
                                                            <i
                                                                className="simple-icon-close delete-icon"
                                                                data-toggle="delete-modal"
                                                                data-target="#delete-modal"
                                                                title={
                                                                    action.delete
                                                                }
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
                additionalText="All transactions related to this customer will also be deleted."
            />
        </Container>
    );
};

const mapStateToProps = (state) => ({
    customer: state.customer,
    loading: state.loading,
    user: state.user,
    language: state.language,
});

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    getCustomers: (page, name) => dispatch(getCustomers(page, name)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetCustomers);
