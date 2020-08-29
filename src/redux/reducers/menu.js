import { SET_MENU_OPEN, SET_MENU_CLOSE, SET_SUB_MENU_OPEN, SET_SUB_MENU_CLOSE } from "../actionTypes";

const initialState = {
    menu: true,
    sub: false
}

export const menu = (state = initialState, action) => {
    switch (action.type) {
        case SET_MENU_OPEN:
            return {...state, menu: true};

        case SET_MENU_CLOSE:
            return {menu: false, sub: false};

        case SET_SUB_MENU_OPEN:
            return {...state, sub: true};

        case SET_SUB_MENU_CLOSE:
            return {...state, sub: false};

        default:
            return state;
    }
};
