import { SET_LANG_EN, SET_LANG_ID } from '../actionTypes';

export const setLanguage = (language = 'en') => (dispatch) => {
    if (language === 'en') {
        dispatch({
            type: SET_LANG_EN,
        });
    } else {
        dispatch({
            type: SET_LANG_ID,
        });
    }
};
