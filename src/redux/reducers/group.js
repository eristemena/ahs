import { GROUP_GET, GROUP_REMOVE } from '../actionTypes';

const initialState = {};

export const group = (state = initialState, action) => {
    switch (action.type) {
        case GROUP_GET:
            return action.payload;

        case GROUP_REMOVE:
            return initialState;

        default:
            return state;
    }
}