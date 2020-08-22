import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { del } from '../../axios';
import { checkAdminMerchant } from '../../utilities';
import {
    DeleteModal,
    CustomPagination,
    TableSearchbar,
} from '../../components';
import { fetchGallons, addAlert, setLoading } from '../../redux/actions';
import CustomSpinner from '../../components/CustomSpinner';
import { Container, Card, CardBody } from 'reactstrap';

const GetGallons = ({
    alert,
    history,
    gallon,
    loading,
    setLoading,
    user,
    fetchGallons,
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [delId, setDelId] = useState(-1);
    const [queryName, setQueryName] = useState('');

    useEffect(() => {
        fetchGallons(page, queryName);
    }, [page, queryName]);

    useEffect(() => {
        if (loading) {
            setTotalPage(() => {
                let a = [];
                for (let i = 1; i <= (gallon ? gallon.totalPage : 1); i++) {
                    a.push(i);
                }
                return a;
            });
        }
    }, [gallon]);

    const deleteData = () => {
        setLoading(true);
        if (delId < 0) {
            setLoading(false);
            return alert('Telah terjadi kesalahan');
        }
        del(
            `/gallons/${delId}`,
            (success) => {
                alert('Data berhasil dihapus', 'success');
                fetchGallons(page);
                setLoading(false);
                setDelId(-1);
            },
            (error) => {
                alert('Telah terjadi kesalahan');
                fetchGallons(page);
                setLoading(false);
                setDelId(-1);
            }
        );
    };

    const activeNav = (type) => {
        if (loading) {
            return true;
        }
        if (type === 'prev') {
            if (page === 1) {
                return true;
            }
        } else {
            if (!gallon || gallon.totalPage < 1) {
                return true;
            } else if (page === gallon.totalPage) {
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

        fetchGallons(1, queryName);
    };

    const inputOnChange = (e) => {
        if (e.target.value.length === 0) {
            fetchGallons(page, '');
        } else {
            setQueryName(e.target.value);
        }
    };

    return (
        <Container fluid>
            <div className="d-sm-flex flex-column flex-sm-row justify-content-between mb-3 align-middle">
                <h1>Gallons</h1>
                <div className="d-sm-flex flex-column flex-sm-row">
                    <button
                        className={`btn btn-primary font-weight-bold mr-2 mt-2 table-button ${
                            !checkAdminMerchant(user) ? 'disabled' : ''
                        }`}
                        disabled={!checkAdminMerchant(user)}
                        onClick={() => history.push('/gallons/add')}>
                        ADD GALLON
                    </button>
                    <button
                        className={`btn btn-success font-weight-bold mt-2 table-button ${
                            !checkAdminMerchant(user) ? 'disabled' : ''
                        }`}
                        disabled={!checkAdminMerchant(user)}
                        onClick={() => history.push('/gallons/stocks/get')}>
                        STOCK HISTORY
                    </button>
                </div>
            </div>
            <TableSearchbar
                searchName={searchName}
                inputOnChange={inputOnChange}
            />
            <Container fluid>
                <div className="custom-table">
                    <Card className="gallon">
                        <CardBody>
                            <table className="gallon-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>Name</th>
                                        <th>Stock</th>
                                        {checkAdminMerchant(user) ? (
                                            <th>Actions</th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        gallon.data &&
                                        gallon.data.length > 0 ? (
                                            gallon.data.map((gal) => (
                                                <tr
                                                    key={gal.id}
                                                    role="row"
                                                    className="text-center">
                                                    <td>{gal.name}</td>
                                                    <td>{gal.stock}</td>
                                                    {checkAdminMerchant(
                                                        user
                                                    ) ? (
                                                        <td>
                                                            <Link
                                                                to={`/gallons/edit?id=${gal.id}`}
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
                                                                onClick={() =>
                                                                    setDelId(
                                                                        gal.id
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
                                                            ? 3
                                                            : 2
                                                    }
                                                    className="text-center">
                                                    Belum ada galon, silahkan
                                                    tambahkan galon
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr className="align-middle">
                                            <td
                                                colSpan={
                                                    checkAdminMerchant(user)
                                                        ? 3
                                                        : 2
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
            <DeleteModal
                deleteHandler={deleteData}
                additionalText="All stock history related to this item will also be deleted."
            />
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message, type) => dispatch(addAlert(message, type)),
    fetchGallons: (page, name) => dispatch(fetchGallons(page, name)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    gallon: state.gallon,
    loading: state.loading,
    user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetGallons);
