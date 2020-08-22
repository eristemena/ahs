exports.formatPrice = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

exports.checkAdminMerchant = (user) => {
    return user.merchant_id !== null && user.group_id === 1;
};

exports.parseType = (type) => {
    switch (type) {
        case 'sell':
            return 'Sell';
        case 'buy':
            return 'Buy';
        case 'borrow':
            return 'Borrow';
        case 'return':
            return 'Return';
        default:
            return '';
    }
}