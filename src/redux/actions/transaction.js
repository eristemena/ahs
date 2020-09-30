import { get } from '../../axios';
import { addAlert } from './alert';
import { setLoading } from './loading';
import { logout } from './user';
import { TRANSACTION_ADD } from '../actionTypes';

export const getTransactions = (page, sort, date, limit) => (dispatch) => {
    dispatch(setLoading(true));
    console.log(page, sort, date, limit)
    get(
        `/transactions?limit=${limit}&page=${page}${sort ? `&sort=${sort}-desc` : ''}${
            date ? `&date=${date}` : ''
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
                    dispatch(addAlert(`Terjadi kesalahan: ${error.message}`));
                }
            } else {
                dispatch(addAlert('Terjadi kesalahan'));
            }
            dispatch(setLoading(false));
        }
    );
};
