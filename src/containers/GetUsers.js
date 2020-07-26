import React, { useState, useEffect } from 'react';
import { get } from '../axios';
import { addAlert } from '../redux/actions/alert';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLoading } from '../redux/actions/loading';
import CustomSpinner from '../components/CustomSpinner';
import { Container } from 'reactstrap';

const GetUsers = ({ alert, loading, setLoading }) => {
    const [users, setList] = useState([]);
    const [d, setD] = useState('d-none');

    useEffect(() => {
        setLoading(true);
        get(
            '/users',
            (success) => {
                setD(() => '');
                setList(() => success.data);
                setLoading(false);
            },
            (error) => {
                alert(`Telah terjadi kesalahan`);
                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="container-fluid">
            <div className="mb-3">
                <h1>Users</h1>
            </div>
            <Container fluid>
                <div className="custom-table">
                    <table className="users-table">
                        <thead>
                            <tr className="text-center">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Merchant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? (
                                users.map((user) => (
                                    <tr key={user.id} className="text-center">
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.merchant
                                                ? user.merchant.name
                                                : '(SUPER ADMIN)'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        <CustomSpinner
                                            loading={loading}
                                            type="table"
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    setLoading: (loading) => dispatch(setLoading(loading)),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetUsers);
