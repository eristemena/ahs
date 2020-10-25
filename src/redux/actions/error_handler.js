import { addAlert, logout } from './';

export const error_handler = (error) => (dispatch) => {
    if (error && error.message) {
        if (error.message === 'jwt expired, please login.') {
            dispatch(addAlert('Anda belum login setelah seminggu. Harap login lagi.'));
            dispatch(logout());
        } else if (error.message !== 'Need authorization header') {
            dispatch(addAlert(`Telah terjadi kesalahan: ${error.message}`));
        }
    } else {
        dispatch(addAlert('Telah terjadi kesalahan'));
    }
};
