import {combineReducers} from 'redux'
import {ErrorReducer, LoadingReducer} from './ErrorReducer'
import AuthReducer from './AuthReducer'
import InitReducer from './InitReducer'
import PageReducer from "./PageReducer";
import ProductReducer from "./ProductReducer";
import CartReducer from "./CartReducer";

const RootReducer = combineReducers({
   ERRORS: ErrorReducer,
   LOADING: LoadingReducer,
   AUTH: AuthReducer,
   INIT: InitReducer,
   PAGE: PageReducer,
   PRODUCTS: ProductReducer,
   CART: CartReducer,
});

export default RootReducer