import { PRODUCT_SET, PRODUCTS_SET, PRODUCT_DELETE, PRODUCT_STATE_CLEAR,} from "../actions/actionTypes";

const initialState = {
  products: [],
  // Các state khác
};

const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case PRODUCT_SET:
    return { ...state, product: payload }

    case PRODUCTS_SET:
    return { ...state, products: payload }

    case PRODUCT_DELETE:
        return { 
          ...state, 
          products: state.products.filter(product => product.id !== payload),
        };


    case PRODUCT_STATE_CLEAR:
        return { 
            product: {},
            products: [],
            content: [],
        };

  default:
    return state
  }
}

export default productReducer;