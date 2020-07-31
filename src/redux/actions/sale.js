import { SALES_ADD } from '../actionTypes';
import { addAlert } from './alert';
import { setLoading } from './loading';
import { get } from '../../axios';

export const getSales = (week_code = 1) => (dispatch) => {
    dispatch(setLoading(true));
    get(
        `/products/sales/${week_code}`,
        ({ data }) => {
            dispatch({
                type: SALES_ADD,
                payload: {
                    data,
                },
            });
            dispatch(setLoading(false));
        },
        (error) => {
            dispatch(setLoading(false));
            dispatch(addAlert('Telah terjadi kesalahan'));
        }
    );
};
