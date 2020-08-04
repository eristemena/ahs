import React, { useEffect, useState, Fragment } from 'react';
import { addAlert } from '../../redux/actions/alert';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTransactions } from '../../redux/actions/transaction';
import moment from 'moment';
import 'moment/locale/id';
import { del } from '../../axios';
import { formatPrice, checkAdminMerchant } from '../../utilities';
import { DeleteModal, InfoTooltip } from '../../components';
import { setLoading } from '../../redux/actions/loading';
import CustomSpinner from '../../components/CustomSpinner';
import {
    Container,
    Pagination,
    PaginationItem,
    PaginationLink,
    Card,
    CardBody,
} from 'reactstrap';
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

    useEffect(() => {
        getTransaction(page);
    }, [page]);

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
                getTransaction(page);
                setLoading(false);
                setDelId(-1);
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                getTransaction(page);
                setLoading(false);
                setDelId(-1);
            }
        );
    };

    const {
        transactions: {
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
                    onClick={() => history.push('/transactions/add')}>
                    {add_transaction}
                </button>
            </div>
            <Container fluid>
                <div className="custom-table">
                    <Card className="transaction">
                        <CardBody>
                            <table className="transaction-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>{table.date}</th>
                                        <th>{table.name}</th>
                                        <th>{table.type}</th>
                                        <th>{table.quantity}</th>
                                        <th>{table.price}</th>
                                        <th>{table.customer}</th>
                                        {checkAdminMerchant(user) ? (
                                            <th>{action.action}</th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        transaction &&
                                        transaction.data &&
                                        transaction.data.length > 0 ? (
                                            transaction.data.map((tran) => (
                                                <tr
                                                    key={tran.id}
                                                    role="row"
                                                    className="text-center">
                                                    <td>
                                                        {moment(
                                                            tran.date
                                                        ).format('LL')}
                                                    </td>
                                                    <td>{tran.product.name}</td>
                                                    <td>
                                                        {tran.type === 'sell'
                                                            ? 'Jual'
                                                            : 'Beli'}
                                                    </td>
                                                    <td>{tran.quantity}</td>
                                                    <td>
                                                        Rp.{' '}
                                                        {formatPrice(
                                                            tran.type === 'sell'
                                                                ? tran.price
                                                                : tran.buying_price
                                                        )}
                                                    </td>
                                                    <td>
                                                        {tran.customer
                                                            ? tran.customer.name
                                                            : '~'}
                                                    </td>
                                                    {checkAdminMerchant(
                                                        user
                                                    ) ? (
                                                        <td>
                                                            <Link
                                                                to={`/transactions/edit?id=${tran.id}`}
                                                                className="mr-2">
                                                                <i
                                                                    className="simple-icon-note edit-icon"
                                                                    title={
                                                                        action.edit
                                                                    }></i>
                                                            </Link>
                                                            <i
                                                                className={`simple-icon-close delete-icon ${
                                                                    tran.info
                                                                        ? 'mr-2'
                                                                        : ''
                                                                }`}
                                                                data-toggle="modal"
                                                                data-target="#modal"
                                                                title={
                                                                    action.delete
                                                                }
                                                                onClick={(e) =>
                                                                    setDelId(
                                                                        tran.id
                                                                    )
                                                                }></i>
                                                            {tran.info ? (
                                                                <Fragment>
                                                                    <InfoTooltip
                                                                        info={
                                                                            tran.info
                                                                        }
                                                                    />
                                                                </Fragment>
                                                            ) : null}
                                                        </td>
                                                    ) : null}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="text-center">
                                                    Belum ada transaksi,
                                                    silahkan tambahkan transaksi
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr className="align-middle">
                                            <td
                                                colSpan="7"
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

            <DeleteModal deleteHandler={deleteData} />
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    getTransaction: (page) => dispatch(getTransactions(page)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    transaction: state.transaction,
    user: state.user,
    loading: state.loading,
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetTransaction);
