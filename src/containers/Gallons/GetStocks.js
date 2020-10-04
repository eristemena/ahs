import React, { useEffect, useState, Fragment } from 'react';
import { addAlert } from '../../redux/actions/alert';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchStocks } from '../../redux/actions/gallon_stock';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/id';
import { del } from '../../axios';
import { checkAdminMerchant, parseType } from '../../utilities';
import {
    DeleteModal,
    InfoTooltip,
    CustomPagination,
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
    Row,
    Col,
} from 'reactstrap';
import { intlMessage } from '../../language';
registerLocale('id', id);

const GetGallonStocks = ({
    alert,
    fetchStocks,
    gallon_stock,
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

    useEffect(() => {
        fetchStocks(
            page,
            limit,
            sortBy,
            dateSearch ? moment(dateSearch).format('YYYY-MM-DD') : null
        );
    }, [page, sortBy, dateSearch, limit]);

    useEffect(() => {
        if (loading) {
            setTotalPage(() => {
                let a = [];
                for (
                    let i = 1;
                    i <= (gallon_stock ? gallon_stock.totalPage : 1);
                    i++
                ) {
                    a.push(i);
                }
                return a;
            });
        }
    }, [gallon_stock]);

    const activeNav = (type) => {
        if (loading) {
            return true;
        }
        if (type === 'prev') {
            if (page === 1) {
                return true;
            }
        } else {
            if (!gallon_stock || gallon_stock.totalPage < 1) {
                return true;
            } else if (page === gallon_stock.totalPage) {
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
            `/stocks/${delId}`,
            (success) => {
                alert('Data berhasil dihapus', 'success');
                fetchStocks(page);
                setLoading(false);
                setDelId(-1);
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                fetchStocks(page);
                setLoading(false);
                setDelId(-1);
            }
        );
    };

    const { gallons: {get}, action } = intlMessage(language);

    // const [tableHead, setTableHead] = useState([]);

    // useEffect(() => {
    //     setTableHead(['Name', 'Type', 'Quantity', 'Date', 'Customer']);
    //     if (checkAdminMerchant(user)) {
    //         setTableHead((prevData) => [...prevData, 'Actions']);
    //     }
    // }, []);

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1 className="page-title">{get.title}</h1>
                <div className="d-sm-flex flex-column flex-sm-row">
                    <button
                        className={`btn btn-primary font-weight-bold table-button ${
                            !checkAdminMerchant(user) ? 'disabled' : ''
                        }`}
                        disabled={!checkAdminMerchant(user)}
                        onClick={() => history.push('/gallons/add')}>
                        {get.button}
                    </button>
                </div>
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
                                ? moment(dateSearch).format('DD MMMM yyyy')
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
                <div className="custom-table">
                    <Card className="stock">
                        <CardBody>
                            <table className="stock-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>{get.table.date}</th>
                                        <th>{get.table.type}</th>
                                        <th>{get.table.quantity}</th>
                                        <th>{get.table.customer}</th>
                                        {checkAdminMerchant(user) ? (
                                            <th>{action.action}</th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        <Fragment>
                                            {gallon_stock.data &&
                                            gallon_stock.data.rows.length >
                                                0 ? (
                                                gallon_stock.data.rows.map(
                                                    (galStk) => (
                                                        <tr
                                                            key={galStk.id}
                                                            role="row"
                                                            className="text-center">
                                                            <td>
                                                                {moment(
                                                                    galStk.date
                                                                ).format('LL')}
                                                            </td>
                                                            <td>{parseType(galStk.type, language)}
                                                            </td>
                                                            <td>
                                                                {
                                                                    galStk.quantity
                                                                }
                                                            </td>
                                                            <td>
                                                                {galStk.customer
                                                                    ? galStk
                                                                          .customer
                                                                          .name
                                                                    : '~'}
                                                            </td>
                                                            {checkAdminMerchant(
                                                                user
                                                            ) ? (
                                                                <td>
                                                                    <Link
                                                                        to={`/gallons/edit?id=${galStk.id}`}
                                                                        className="mr-2">
                                                                        <i
                                                                            className="simple-icon-note edit-icon"
                                                                            title={action.edit}></i>
                                                                    </Link>
                                                                    <i
                                                                        className={`simple-icon-close delete-icon ${
                                                                            galStk.info
                                                                                ? 'mr-2'
                                                                                : ''
                                                                        }`}
                                                                        title={action.delete}
                                                                        onClick={() => {
                                                                            setDelId(
                                                                                galStk.id
                                                                            );
                                                                            setModalToggle(true)
                                                                        }}></i>
                                                                    {galStk.info ? (
                                                                        <Fragment>
                                                                            <InfoTooltip
                                                                                info={
                                                                                    galStk.info
                                                                                }
                                                                            />
                                                                        </Fragment>
                                                                    ) : null}
                                                                </td>
                                                            ) : null}
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            checkAdminMerchant(
                                                                user
                                                            )
                                                                ? 6
                                                                : 5
                                                        }
                                                        className="text-center">
                                                        {get.table.no_data}
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ) : (
                                        <tr className="align-middle">
                                            <td
                                                colSpan={
                                                    checkAdminMerchant(user)
                                                        ? 6
                                                        : 5
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
                    currentPage={page}
                    pages={totalPage}
                    activePage={activePage}
                    setPage={setPage}
                    activeNav={activeNav}
                />
            </Container>
            <DeleteModal toggle={modalToggle} setToggle={setModalToggle} deleteHandler={deleteData} />
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    fetchStocks: (page, limit, sort, date) =>
        dispatch(fetchStocks(page, limit, sort, date)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    gallon_stock: state.gallon_stock,
    user: state.user,
    loading: state.loading,
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetGallonStocks);
