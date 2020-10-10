import { addAlert, deleteAlert } from './alert';
import { setLoading } from './loading';
import { fetchStocks } from './gallon_stock';
import { setMenuState, setSubMenuState } from './menu';
import { getProducts } from './product';
import { getStocks as getProductStocks } from './product_stock';
import { logout } from './user';
import { getGroups } from './group';

export {
    addAlert,
    deleteAlert,
    setLoading,
    fetchStocks,
    setMenuState,
    setSubMenuState,
    getProducts,
    getProductStocks,
    logout,
    getGroups,
};
