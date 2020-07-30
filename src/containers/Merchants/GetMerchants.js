import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getMerchants } from '../../redux/actions/merchant';
import CustomSpinner from '../../components/CustomSpinner';
import {
    Container,
    Pagination,
    PaginationItem,
    PaginationLink,
    Card,
    CardBody,
} from 'reactstrap';

const GetMerchants = ({ getMerchants, loading, merchant, history }) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [queryName, setQueryName] = useState('');

    useEffect(() => {
        getMerchants(page, queryName)
    }, [page]);

    useEffect(() => {
        if (loading) {
            setTotalPage(() => {
                let a = [];
                for (let i = 1; i <= (merchant.totalPage ? merchant.totalPage : 1); i++) {
                    a.push(i);
                }
                return a;
            });
        }
    }, [merchant]);

    const activeNav = (type) => {
        if (loading) {
            return true;
        }
        if (type === 'prev') {
            if (page === 1) {
                return true;
            }
        } else {
            if (!merchant.totalPage || merchant.totalPage < 1) {
                return true;
            } else if (page === merchant.totalPage) {
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

    const searchName = (e) => {
        e.preventDefault();

        getMerchants(1, queryName);
    };

    const inputOnChange = (e) => {
        if (e.target.value.length === 0) {
            getMerchants(page, '');
        } else {
            setQueryName(e.target.value);
        }
    };

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1>Merchant</h1>
                <button
                    className="btn btn-primary font-weight-bold table-button"
                    onClick={() => history.push('/merchants/add')}>
                    ADD MERCHANT
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
                    <Card className="merchant">
                        <CardBody>
                            <table className="merchant-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>ID</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        merchant.data &&
                                        merchant.data.length > 0 ? (
                                            merchant.data.map((merchant) => (
                                                <tr
                                                    key={merchant.id}
                                                    className="text-center">
                                                    <td>{merchant.id}</td>
                                                    <td>{merchant.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center">
                                                    {queryName.length > 0
                                                        ? 'Merchant tidak ditemukan'
                                                        : 'Belum ada merchant'}
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="2"
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
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    getMerchants: (page, name) => dispatch(getMerchants(page, name))
});

const mapStateToProps = (state) => ({
    loading: state.loading,
    merchant: state.merchant
})

export default connect(mapStateToProps, mapDispatchToProps)(GetMerchants);
