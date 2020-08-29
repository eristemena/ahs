import { SET_MENU_OPEN, SET_MENU_CLOSE, SET_SUB_MENU_CLOSE, SET_SUB_MENU_OPEN } from '../actionTypes';

export const setMenuState = (menu) => (dispatch) => {
    if (menu) {
        dispatch({ type: SET_MENU_OPEN });
    } else {
        dispatch({ type: SET_MENU_CLOSE });
    }
};

export const setSubMenuState = (sub) => (dispatch) => {
    if (sub) {
        dispatch({ type: SET_SUB_MENU_OPEN });
    } else {
        dispatch({ type: SET_SUB_MENU_CLOSE });
    }
}