import {combineReducers} from "redux";
import productReducer from "./redux/product/reducer";
import pricesReducer from "./redux/prices/reducer";

const rootReducer = combineReducers({
    productsComponent: productReducer,
    pricesComponent: pricesReducer
});

export default rootReducer