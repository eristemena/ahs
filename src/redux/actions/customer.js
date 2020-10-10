import { get } from '../../axios';
import { addAlert } from './alert';
import { setLoading } from './loading';
import { logout } from './user';
import { CUSTOMER_ADD } from '../actionTypes';

export const getCustomers = (page, name) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/customers?page=${page}&limit=7${name ? `&name=${name}` : ''}`,
        ({ data, totalPage, totalData, page }) => {
            dispatch({
                type: CUSTOMER_ADD,
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
