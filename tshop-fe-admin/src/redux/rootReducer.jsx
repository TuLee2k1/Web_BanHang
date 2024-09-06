import categoryReducer from "./reducers/categoryReducer";
import { combineReducers } from "redux";
import productReducer from "./reducers/productReducer";

const rootReducer = combineReducers({
    categoryReducer : categoryReducer,
    productReducer
});

export default rootReducer;
