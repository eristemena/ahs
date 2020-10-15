import { addAlert, setLoading, logout, error_handler } from './index';
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
            dispatch(error_handler(error))
            dispatch(setLoading(false));
        }
    );
};
