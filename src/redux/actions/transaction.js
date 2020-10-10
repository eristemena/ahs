import { get } from '../../axios';
import { addAlert } from './alert';
import { setLoading } from './loading';
import { logout } from './user';
import { TRANSACTION_ADD } from '../actionTypes';

export const getTransactions = (page, sort, date, limit) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/transactions?limit=${limit}&page=${page}${sort ? `&sort=${sort}-desc` : ''}${
            date !== null ? `&start_date=${date}&end_date=${date}` : ''
        }`,
        ({ data, page, totalPage, totalData }) => {
            dispatch({
                type: TRANSACTION_ADD,
                payload: {
                    totalPage,
                    totalData,
                    page,
                    data,
                },
            });
            dispatch(setLoading(false));
        },
        (error) => {
            if (error) {
                if (error.message === 'jwt expired, please login.') {
                    dispatch(
                        addAlert(
                            'Anda belum login setelah seminggu. Harap login lagi.'
                        )
                    );
                    dispatch(logout());
                } else if (error.message !== 'Need authorization header') {
                    dispatch(addAlert(`Telah terjadi kesalahan: ${error.message}`));
                }
            } else {
                dispatch(addAlert('Telah terjadi kesalahan'));
            }
            dispatch(setLoading(false));
        }
    );
};
