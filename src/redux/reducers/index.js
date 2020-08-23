import { combineReducers } from 'redux';
import { alert } from './alert';
import { user } from './user';
import { product } from './product';
import { transaction } from './transaction';
import { stock as product_stock } from './product_stock';
import { loading } from './loading';
import { customer } from './customer';
import { menu } from './menu';
import { merchant } from './merchant';
import { language } from './language';
import { sale } from './sale';
import { gallonStock as gallon_stock } from './gallon_stock';

export default combineReducers({
    alert,
    user,
    product,
    transaction,
    product_stock,
    loading,
    customer,
    menu,
    merchant,
    language,
    sale,
    gallon_stock,
});
