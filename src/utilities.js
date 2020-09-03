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
