import React, { useEffect, useState } from 'react';
import { addAlert, setLoading, getGroups, logout } from '../../../redux/actions';
import { connect } from 'react-redux';
import { checkAdminMerchant, errorHandler } from '../../../utilities';
import {
    DeleteModal,
    TableSearchbar,
    CustomPagination,
    Table,
} from '../../../components';
import { del } from '../../../axios';
import {
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
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
    logout
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [delId, setDelId] = useState(-1);
    const [queryName, setQueryName] = useState('');
    const [sortBy, setSortBy] = useState('updated_at');
    const [limit, setLimit] = useState(8);

    const [modalToggle, setModalToggle] = useState(false);

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
                errorHandler(error, alert, logout)
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
            <div className="d-flex flex-column flex-sm-row justify-content-between mb-3">
                <div className="d-flex flex-column flex-sm-row">
                    <UncontrolledDropdown className="my-auto">
                        <DropdownToggle className="d-flex justify-content-center justify-content-md-between align-middle sorting-button mr-2">
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
                    <TableSearchbar
                        searchName={searchName}
                        inputOnChange={inputOnChange}
                        className="my-auto"
                    />
                </div>
                <div className="d-flex flex-column flex-sm-row">
                    <p
                        className="my-auto mr-2 text-center"
                        style={{ color: '#808080' }}>
                        Show entries:
                    </p>
                    <UncontrolledDropdown className="my-auto">
                        <DropdownToggle className="d-flex justify-content-center justify-content-md-between sorting-button">
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
                    tableClassName="group"
                    tableHead={[
                        table.name,
                        table.quantity,
                        checkAdminMerchant(user) ? action.action : table.merchant
                    ]}
                    tableBody={group && group.data && group.data.map((item) => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        merchant_action: !checkAdminMerchant(user) ? item.owner.name : null
                    }))}
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
    getGroups: (page, sort, name, limit) => dispatch(getGroups(page, sort, name, limit)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    logout: () => dispatch(logout())
});

const mapStateToProps = (state) => ({
    group: state.group,
    loading: state.loading,
    user: state.user,
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetGroups);
