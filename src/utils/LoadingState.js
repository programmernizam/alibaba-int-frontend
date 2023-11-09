import store from "../store";
import * as Types from "../store/actions/types";
import { clearGlobalErrors } from "./GlobalStateControl";

export const in_loading = (clearError = true) => {
  if (clearError) {
    clearGlobalErrors();
  }
  store.dispatch({
    type: Types.GLOBAL_LOADING,
    payload: {
      isLoading: true,
    },
  });
};

export const product_details_loading = (loadValue = true) => {
  store.dispatch({
    type: Types.PRODUCT_DETAILS_LOADING,
    payload: {
      product_details_loading: loadValue,
    },
  });
};

export const category_loading = (loadValue = true) => {
  store.dispatch({
    type: Types.CATEGORY_LOADING,
    payload: {
      category_loading: loadValue,
    },
  });
};

export const banner_loading = (loadValue = true) => {
  store.dispatch({
    type: Types.CATEGORY_LOADING,
    payload: {
      banner_loading: loadValue,
    },
  });
};

export const search_product_loading = (loadValue = true) => {
  store.dispatch({
    type: Types.SEARCH_PRODUCT_LOADING,
    payload: {
      search_product_loading: loadValue,
    },
  });
};
export const place_loading = (loadValue = true) => {
  store.dispatch({
    type: Types.PLACE_LOADING,
    payload: {
      place_loading: loadValue,
    },
  });
};

export const out_loading = () => {
  store.dispatch({
    type: Types.GLOBAL_LOADING,
    payload: {
      isLoading: false,
    },
  });
};
