import * as Types from "../actions/types";

const CartReducer = (
  state = {
    Attribute: {},
    SelectConfiguredItems: [],
    configured: [],
    shipping_address: {},
    billing_address: {},
    advance_percent: { advance_percent: 50 },
    discount_percent: { discount_percent: 0 },
    payment_method: {},
    virtualCart: [],
    couponDetails: {},
  },
  action
) => {
  switch (action.type) {
    case Types.SELECT_ATTRIBUTE: {
      return { ...state, Attribute: action.payload.Attribute };
    }
    case Types.SELECT_CONFIGURED_ITEMS: {
      return { ...state, SelectConfiguredItems: action.payload.SelectConfiguredItems };
    }
    case Types.SELECT_CONFIGURED: {
      return { ...state, configured: action.payload.configured };
    }
    case Types.SELECT_SHIPPING_ADDRESS: {
      return { ...state, shipping_address: action.payload.shipping_address };
    }
    case Types.SELECT_BILLING_ADDRESS: {
      return { ...state, billing_address: action.payload.billing_address };
    }
    case Types.SELECT_ADVANCE_PERCENT: {
      return { ...state, advance_percent: action.payload.advance_percent };
    }
    case Types.SELECT_DISCOUNT_PERCENT: {
      return { ...state, discount_percent: action.payload.discount_percent };
    }
    case Types.SELECT_PAYMENT_METHOD: {
      return { ...state, payment_method: action.payload.payment_method };
    }
    case Types.ADD_PRODUCT_VIRTUAL: {
      return { ...state, virtualCart: action.payload.virtualCart };
    }
    case Types.ADD_CATEGORY_VIRTUAL: {
      return { ...state, virtualCart: [{ ...state.virtualCart[0], ...action.payload }] };
    }
    case Types.REMOVE_PRODUCT_VIRTUAL: {
      return { ...state, virtualCart: [] };
    }
    case Types.ADD_COUPON_DETAILS: {
      return { ...state, couponDetails: action.payload.couponDetails };
    }
    default:
      return state;
  }
};

export default CartReducer;
