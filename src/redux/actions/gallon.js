import { FETCH_GALLONS } from '../actionTypes';
import { get } from '../../axios';
import { setLoading } from './loading';
import { logout } from './user';
import { addAlert } from './alert';

export const fetchGallons = (page, name) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/gallons${name ? `?name=${name}` : ''}`,
        ({data, totalData, totalPage}) => {
            dispatch({
                type: FETCH_GALLONS,
                payload: {
                    totalData,
                    totalPage,
                    data
                }
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
            } else {
                dispatch(addAlert('Terjadi kesalahan'));
            }
            dispatch(setLoading(false));
        }
    )
}