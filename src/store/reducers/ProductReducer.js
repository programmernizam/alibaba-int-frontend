import * as Types from "../actions/types";


const ProductReducer = (state = {
  product_details: [],
}, action) => {
  switch (action.type) {
    case Types.LOAD_PRODUCT_DETAILS: {
      return {...state, product_details: action.payload.product_details};
    }
    default:
      return state;
  }
};

export default ProductReducer;