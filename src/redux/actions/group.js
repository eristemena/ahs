import { addAlert, setLoading, logout } from './index';
import { get } from '../../axios';
import { GROUP_GET } from '../actionTypes';

export const getGroups = (page, sort, name, limit) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/products_groups?page=${page}&limit=${limit || 8}&sort=${
            sort + '-desc' || 'updated_at-desc'
        }${name ? `&name=${name}` : ''}`,
        ({ data, totalData, totalPage }) => {
            dispatch({
                type: GROUP_GET,
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
                    dispatch(addAlert(`Telah terjadi kesalahan: ${error.message}`));
                }
            } else {
                dispatch(addAlert('Telah terjadi kesalahan'));
            }
            dispatch(setLoading(false));
        }
    );
};
