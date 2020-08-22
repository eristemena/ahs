import { get } from '../../axios';
import { addAlert } from './alert';
import { setLoading } from './loading';
import { logout } from './user';
import { STOCKS_ADD } from '../actionTypes';

export const getStocks = () => (dispatch) => {
    dispatch(setLoading(true))
    get(
        `/products/stocks`,
        ({ data }) => {
            dispatch({
                type: STOCKS_ADD,
                payload: {
                    data,
                },
            });
            dispatch(setLoading(false))
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
            }
            dispatch(setLoading(false))
        }
    );
};
