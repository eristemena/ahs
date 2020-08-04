import { SET_LANG_EN, SET_LANG_ID } from '../actionTypes';

export const language = (state = 'id', action) => {
    switch (action.type) {
        case SET_LANG_ID:
            return 'id';

        case SET_LANG_EN:
            return 'en';

        default:
            return state;
    }
};
