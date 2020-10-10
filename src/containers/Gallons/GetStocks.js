import React, { useEffect, useState } from 'react';
import { addAlert } from '../../redux/actions/alert';
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
    CustomPagination,
    Table,
} from '../../components';
import { setLoading } from '../../redux/actions/loading';
import {
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
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

    const {
        gallons: {
            get: { title, table, button },
        },
        action,
    } = intlMessage(language);

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1 className="page-title">{title}</h1>
                <div className="d-sm-flex flex-column flex-sm-row">
                    <button
                        className={`btn btn-primary font-weight-bold table-button ${
                            !checkAdminMerchant(user) ? 'disabled' : ''
                        }`}
                        disabled={!checkAdminMerchant(user)}
                        onClick={() => history.push('/gallons/add')}>
                        {button}
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
                <Table 
                    tableClassName="stock" 
                    noDataMessage={table.no_data}
                    tableHead={[
                        table.date,
                        table.type,
                        table.quantity,
                        table.customer,
                        checkAdminMerchant(user) ? action.action : null
                    ]}
                    tableBody={gallon_stock && gallon_stock.data && gallon_stock.data.rows && gallon_stock.data.rows.map((item) => ({
                        id: item.id,
                        date: moment(item.date).format('LL'),
                        type: parseType(item.type, language),
                        quantity: item.quantity,
                        customer: item.customer ? item.customer.name : '~',
                        info: item.info
                    }))}
                    deleteId
                    loading={loading}
                    deleteFunction={setDelId}
                    setModal={setModalToggle}
                    actions={checkAdminMerchant(user) && {
                        edit: '/gallons/edit',
                        info: true
                    }}
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
