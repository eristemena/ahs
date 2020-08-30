import React, { useState, useEffect } from 'react';
import { get } from '../../axios';
import { addAlert } from '../../redux/actions/alert';
import { connect } from 'react-redux';
import { setLoading } from '../../redux/actions/loading';
import CustomSpinner from '../../components/CustomSpinner';
import { Container, Card, CardBody } from 'reactstrap';
import { intlMessage } from '../../language';

const GetUsers = ({ alert, loading, setLoading, language }) => {
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

    const intlText = intlMessage(language)

    return (
        <div className="container-fluid">
            <div className="mb-3 page-title">
                <h1>{intlText.users.title}</h1>
            </div>
            <Container fluid>
                <div className="custom-table">
                    <Card className="user">
                        <CardBody>
                            <table className="users-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>{intlText.users.table.id}</th>
                                        <th>{intlText.users.table.name}</th>
                                        <th>{intlText.users.table.email}</th>
                                        <th>{intlText.users.table.merchant}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading ? (
                                        users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="text-center">
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
                                            <td
                                                colSpan="4"
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
    language: state.language
});

export default connect(mapStateToProps, mapDispatchToProps)(GetUsers);
