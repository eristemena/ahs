import React, { useEffect, useState, Fragment } from 'react';
import { addAlert } from '../../redux/actions/alert';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTransactions } from '../../redux/actions/transaction';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { del } from '../../axios';
import { formatPrice, checkAdminMerchant, parseType as tableParseType } from '../../utilities';
import {
    DeleteModal,
    InfoTooltip,
    CustomPagination,
    Table as CustomTable,
} from '../../components';
import { setLoading } from '../../redux/actions/loading';
import CustomSpinner from '../../components/CustomSpinner';
import {
    Container,
    Card,
    CardBody,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { intlMessage } from '../../language';
registerLocale('id', id);

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

    const [tableHead, setTableHead] = useState([]);

    useEffect(() => {
        setTableHead([
            table.date,
            table.name,
            table.type,
            table.quantity,
            table.price,
            table.customer,
        ]);
        if (checkAdminMerchant(user)) {
            setTableHead((prevData) => [...prevData, action.action]);
        }
    }, []);

    const parseType = (type) => {
        switch (type) {
            case 'sell':
                return 'Sell';
            case 'buy':
                return 'Buy';
            default:
                return '';
        }
    };

    const showTableData = ({
        date,
        product,
        type,
        customer,
        quantity,
        price,
    }) => {
        const formatDate = moment(date).format('LL');
        const typeParse = parseType(type);
        const priceFormat = formatPrice(price);
        return {
            date: formatDate,
            name: product ? product.name : '~',
            type: typeParse,
            quantity,
            price: price && `Rp. ${priceFormat}`,
            customer: customer ? customer.name : '~',
        };
    };

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1 className="page-title">{title}</h1>
                <button
                    className={`btn btn-primary font-weight-bold table-button ${
                        !checkAdminMerchant(user) ? 'disabled' : ''
                    }`}
                    disabled={!checkAdminMerchant(user)}
                    onClick={() => history.push('/transactions/add')}>
                    {add_transaction}
                </button>
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-between mb-2">
                <div className="d-flex flex-column flex-sm-row">
                    <UncontrolledDropdown>
                        <DropdownToggle className="d-flex justify-content-center justify-content-md-between align-middle sorting-button">
                            <i className="mr-2">
                                Order by:{' '}
                                {sortBy === 'date' ? 'Date' : 'Modified At'}
                            </i>
                            <i className="simple-icon-arrow-down arrow"></i>
                        </DropdownToggle>
                        <DropdownMenu right={false} className="sort-dropdown">
                            <DropdownItem onClick={() => setSortBy('date')}>
                                Date
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => setSortBy('updated_at')}>
                                Modified At
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <ReactDatePicker
                        locale="id"
                        value={
                            dateSearch
                                ? moment(dateSearch).format('DD MMMM YYYY')
                                : ''
                        }
                        selected={dateSearch}
                        className="form-control"
                        wrapperClassName="transaction-table-datepicker"
                        todayButton={`Hari ini (${moment(new Date()).format(
                            'DD MMMM'
                        )})`}
                        placeholderText="Pilih hari"
                        disabledKeyboardNavigation
                        onChange={(e) => {
                            setDateSearch(e);
                            setPage(1);
                        }}
                        maxDate={new Date()}
                        popperPlacement="bottom"
                        popperModifiers={{
                            flip: {
                                enabled: false,
                            },
                        }}
                        isClearable
                    />
                </div>
                <div className="d-flex flex-column flex-sm-row">
                    <p
                        className="my-auto mr-2 text-center"
                        style={{ color: '#808080' }}>
                        Show entries:
                    </p>
                    <UncontrolledDropdown>
                        <DropdownToggle className="d-flex justify-content-center justify-content-md-between align-middle sorting-button">
                            <i className="mr-2"> {limit} </i>
                            <i className="simple-icon-arrow-down arrow"></i>
                        </DropdownToggle>
                        <DropdownMenu right className="show-entry-dropdown">
                            {[4, 8, 12, 20].map((number) => (
                                <DropdownItem
                                    key={number}
                                    onClick={() => {
                                        setLimit(number);
                                        setPage(1);
                                    }}>
                                    {number}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
            <Container fluid>
                {/* <CustomTable tableName={title.toLowerCase()} tableClassName="transaction"
                    tableHead={tableHead}
                    tableBody={{
                        data: transaction.data && transaction.data.map(data => showTableData(data)),
                        actions: checkAdminMerchant(user)
                            && { edit: '/transactions/edit' }
                    }}
                    deleteFunction={setDelId}
                /> */}
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
                                                    <td>{tableParseType(tran.type, language)}</td>
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
                                                    {table.no_data}
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
                <CustomPagination
                    currentPage={page}
                    pages={totalPage}
                    activePage={activePage}
                    setPage={setPage}
                    activeNav={activeNav}
                />
            </Container>

            <DeleteModal deleteHandler={deleteData} />
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
