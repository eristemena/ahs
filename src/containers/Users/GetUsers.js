import React, { useState, useEffect } from 'react';
import { get } from '../../axios';
import { addAlert, setLoading, logout } from '../../redux/actions/';
import { connect } from 'react-redux';
import { Table as CustomTable } from '../../components';
import { Container } from 'reactstrap';
import { intlMessage } from '../../language';

const GetUsers = ({ alert, loading, setLoading, language, logout }) => {
    const [users, setList] = useState([]);

    useEffect(() => {
        setLoading(true);
        get(
            '/users',
            (success) => {
                setList(() => success.data);
                setLoading(false);
            },
            (error) => {
                if (error) {
                    if (error.message === 'jwt expired, please login.') {
                        alert(
                            'Anda belum login setelah seminggu. Harap login lagi.'
                        );
                        logout();
                    } else if (error.message !== 'Need authorization header') {
                        alert(
                            `Telah terjadi kesalahan${
                                error ? `: ${error.message}` : ''
                            }.`
                        );
                    }
                } else {
                    alert(
                        `Telah terjadi kesalahan${
                            error ? `: ${error.message}` : ''
                        }.`
                    );
                }
                setLoading(false);
            }
        );
    }, []);

    const intlText = intlMessage(language);

    return (
        <div className="container-fluid">
            <div className="mb-3 page-title">
                <h1>{intlText.users.title}</h1>
            </div>
            <Container fluid>
                <CustomTable
                    noDataMessage="Tidak ada user"
                    tableClassName="user"
                    tableHead={[
                        intlText.users.table.name,
                        intlText.users.table.email,
                        intlText.users.table.merchant,
                    ]}
                    tableBody={users.map((item) => ({
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        merchant: item.merchant
                            ? item.merchant.name
                            : '(SUPER ADMIN)',
                    }))}
                    loading={loading}
                />
            </Container>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    logout: () => dispatch(logout()),
});

const mapStateToProps = (state) => ({
    loading: state.loading,
    language: state.language,
});

export default connect(mapStateToProps, mapDispatchToProps)(GetUsers);
