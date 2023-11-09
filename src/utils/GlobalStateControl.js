import * as Types from "../store/actions/types";
import _ from "lodash";
import store from "../store";
import { storelocalCart } from "./CartHelpers";
import { instanceAuthToken } from "./AxiosDefault";

export const CheckAndSetErrors = (responseData, errorShow = true) => {
  const errors = !_.isEmpty(responseData) ? responseData.errors : {};
  if (errorShow) {
    if (!_.isEmpty(errors)) {
      store.dispatch({
        type: Types.GQL_ERRORS,
        payload: {
          errors: errors,
        },
      });
    }
  }
  return _.isEmpty(errors);
};

export const setGlobalErrors = (errors) => {
  errors = errors ? errors : {};
  store.dispatch({
    type: Types.GLOBAL_ERROR,
    payload: {
      data: errors.data ? errors.data : {},
      status: errors.status ? errors.status : "",
      statustext: errors.statustext ? errors.statustext : "",
      request: errors.request ? errors.request : {},
    },
  });
};

export const clearGlobalErrors = () => {
  store.dispatch({
    type: Types.GLOBAL_ERROR,
    payload: {
      errors: [],
      data: {},
      status: "",
      statustext: "",
      request: {},
    },
  });
};

export const configAttrToConfigured = (makeConfigured) => {
  store.dispatch({
    type: Types.SELECT_CONFIGURED,
    payload: {
      configured: makeConfigured,
    },
  });
  storelocalCart(makeConfigured);
};

export const selectedActiveAttributes = (Attribute) => {
  store.dispatch({
    type: Types.SELECT_ATTRIBUTE,
    payload: {
      Attribute: Attribute,
    },
  });
};

export const selectedActiveConfiguredItems = (SelectConfiguredItems) => {
  store.dispatch({
    type: Types.SELECT_CONFIGURED_ITEMS,
    payload: {
      SelectConfiguredItems: SelectConfiguredItems,
    },
  });
};

export const updatedShippingAddress = (addressData) => {
  store.dispatch({
    type: Types.SELECT_SHIPPING_ADDRESS,
    payload: {
      shipping_address: addressData,
    },
  });
};
export const addAdvancePaymentPercent = (percent) => {
  store.dispatch({
    type: Types.SELECT_ADVANCE_PERCENT,
    payload: {
      advance_percent: { advance_percent: Number(percent) },
    },
  });
};
export const selectDiscountPercent = (percent) => {
  store.dispatch({
    type: Types.SELECT_DISCOUNT_PERCENT,
    payload: {
      discount_percent: { discount_percent: Number(percent) },
    },
  });
};
export const selectPaymentMethod = (method) => {
  store.dispatch({
    type: Types.SELECT_PAYMENT_METHOD,
    payload: {
      payment_method: { payment_method: method },
    },
  });
};
export const addProductIntoVirtualCart = (payload) => {
  store.dispatch({
    type: Types.ADD_PRODUCT_VIRTUAL,
    payload: {
      virtualCart: payload,
    },
  });
};
export const addCategoryIntoVirtualCart = (payload) => {
  store.dispatch({
    type: Types.ADD_CATEGORY_VIRTUAL,
    payload: {
      ProductCategory: payload,
    },
  });
};
export const removeProductIntoVirtualCart = () => {
  store.dispatch({
    type: Types.REMOVE_PRODUCT_VIRTUAL,
  });
};

export const addCouponDetails = (payload) => {
  store.dispatch({
    type: Types.ADD_COUPON_DETAILS,
    payload: {
      couponDetails: payload,
    },
  });
};
export const setShopAsCustomer = (payload, history, loadCustomerCart, customerWishlist) => {
  if (!_.isEmpty(payload)) {
    store.dispatch({
      type: Types.SET_SHOP_USER,
      payload: {
        isShopAsCustomer: payload.isShopAsCustomer,
        shopAsCustomer: payload.shopAsCustomer,
      },
    });
    window.localStorage.setItem("_shopAsCustomer", JSON.stringify(payload.shopAsCustomer));
    loadCustomerCart(payload.shopAsCustomer.id, payload.isShopAsCustomer);
    customerWishlist(payload.shopAsCustomer.id, payload.isShopAsCustomer);
    history.push("/");
  }
};

export const setShopAsSelf = (payload, history, loadCustomerCart, customerWishlist) => {
  if (!_.isEmpty(payload)) {
    store.dispatch({
      type: Types.SET_SHOP_USER,
      payload: {
        isShopAsCustomer: payload.isShopAsCustomer,
        shopAsCustomer: payload.shopAsCustomer,
      },
    });
    window.localStorage.removeItem("_shopAsCustomer");
    loadCustomerCart();
    customerWishlist();
    history.push("/");
  }
};
