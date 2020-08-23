import { FETCH_STOCKS } from '../actionTypes';
import { get } from '../../axios';
import { setLoading } from './loading';
import { logout } from './user';
import { addAlert } from './alert';

export const fetchStocks = (page, limit, sort, date) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/stocks?limit=${limit || 8}&page=${page || 1}${
            sort ? `&sort=${sort}-desc` : ''
        }${date ? `&date=${date}` : ''}`,
        ({ data, totalData, totalPage }) => {
            dispatch({
                type: FETCH_STOCKS,
                payload: {
                    totalData,
                    totalPage,
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
    )
};
