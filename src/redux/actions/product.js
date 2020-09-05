import { get } from '../../axios';
import { addAlert } from './alert';
import { PRODUCT_GET } from '../actionTypes';
import { logout } from './user';
import { setLoading } from './loading';

export const getProducts = (page, name, limit) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/products?limit=${limit || 8}&page=${page}${name ? `&name=${name}` : ''}`,
        ({ data, totalPage, totalData, page }) => {
            dispatch({
                type: PRODUCT_GET,
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
