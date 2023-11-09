import * as Types from "../actions/types";

const AuthReducer = (
  state = {
    isAuthenticated: false,
    token: null,
    user: {},
    OTP_response: {
      status: false,
      message: "",
      data: [],
    },
    admin: [],
    wishlist: [],
    isShopAsCustomer: null,
    shopAsCustomer: {},
    role: "",
  },
  action
) => {
  switch (action.type) {
    case Types.SET_USER: {
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
        OTP_response: action.payload.OTP_response,
      };
    }
    case Types.SET_SHOP_USER: {
      return {
        ...state,
        isShopAsCustomer: action.payload.isShopAsCustomer,
        shopAsCustomer: action.payload.shopAsCustomer,
      };
    }
    case Types.OTP_SUBMIT: {
      return {
        ...state,
        OTP_response: action.payload.OTP_response,
      };
    }
    case Types.WISHLIST: {
      return {
        ...state,
        wishlist: action.payload.wishlist,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
