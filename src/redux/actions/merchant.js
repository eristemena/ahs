import { MERCHANT_SET } from '../actionTypes';
import { get } from '../../axios';
import { addAlert } from './alert';
import { logout } from './user';
import { setLoading } from './loading';

export const getMerchants = (page = 1, name) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/merchants?page=${page}${name ? `&name=${name}` : ''}`,
        ({ data, page, totalData, totalPage }) => {
            dispatch({
                type: MERCHANT_SET,
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
