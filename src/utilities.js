exports.formatPrice = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

exports.checkAdminMerchant = (user) => {
    return user.merchant_id !== null && user.group_id === 1;
};

const { intlMessage } = require('./language');

exports.parseType = (type, language) => {
    const { parse_type } = intlMessage(language);
    switch (type) {
        case 'sell':
            return parse_type.sell;
        case 'buy':
            return parse_type.buy;
        case 'borrow':
            return parse_type.borrow;
        case 'return':
            return parse_type.return;
        default:
            return '';
    }
};

exports.errorHandler = (error, alert = () => {}, logout = () => {}) => {
    if (error) {
        if (error.message === 'jwt expired, please login.') {
            alert('Anda belum login setelah seminggu. Harap login lagi.');
            logout();
        } else if (error.message !== 'Need authorization header') {
            alert(
                `Telah terjadi kesalahan${
                    error ? `: ${error.message}` : ''
                }.`
            );
        }
    } else {
        alert(
            `Telah terjadi kesalahan${error ? `: ${error.message}` : ''}.`
        );
    }
}
