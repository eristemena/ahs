import { LOADING_START, LOADING_END } from '../actionTypes';

export const setLoading = (loading) => (dispatch) => {
    if (loading) {
        dispatch({ type: LOADING_START });
    } else {
        dispatch({ type: LOADING_END });
    }
};
