import { ALERT_ADD, ALERT_REMOVE } from "../actionTypes";
import { v4 as uuidv4 } from "uuid";

export const addAlert = (message, type = "danger") => (dispatch) => {
    const id = uuidv4();

    dispatch({
        type: ALERT_ADD,
        payload: {
            id,
            type,
            message,
        },
    });

    setTimeout(() => {
        dispatch({
            type: ALERT_REMOVE,
            id,
        });
    }, 5000);
};

export const deleteAlert = (id) => (dispatch) => {
    dispatch({
        type: ALERT_REMOVE,
        id,
    });
}
