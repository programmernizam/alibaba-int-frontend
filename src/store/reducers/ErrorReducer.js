import * as Types from "../actions/types";

export const ErrorReducer = (
  state = {
    errors: [],
    data: {},
    status: "",
    statusText: "",
    request: {},
  },
  action
) => {
  switch (action.type) {
    case Types.GLOBAL_ERROR: {
      return {
        data: action.payload.data,
        status: action.payload.status,
        statusText: action.payload.statusText,
        request: action.payload.request,
      };
    }
    default:
      return state;
  }
};

export const LoadingReducer = (
  state = {
    isLoading: false,
    banner_loading: false,
    category_loading: false,
    cat_product_loading: false,
    search_product_loading: false,
    product_details_loading: false,
    description_loading: false,
    seller_info_loading: false,
    page_loading: false,
    address_loading: false,
    place_loading: false,
  },
  action
) => {
  switch (action.type) {
    case Types.GLOBAL_LOADING: {
      return { ...state, isLoading: action.payload.isLoading };
    }
    case Types.CATEGORY_LOADING: {
      return { ...state, category_loading: action.payload.category_loading };
    }
    case Types.BANNER_LOADING: {
      return { ...state, banner_loading: action.payload.banner_loading };
    }
    case Types.CAT_PRODUCT_LOADING: {
      return { ...state, cat_product_loading: action.payload.cat_product_loading };
    }
    case Types.SEARCH_PRODUCT_LOADING: {
      return { ...state, search_product_loading: action.payload.search_product_loading };
    }
    case Types.PRODUCT_DETAILS_LOADING: {
      return { ...state, product_details_loading: action.payload.product_details_loading };
    }
    case Types.DESCRIPTION_LOADING: {
      return { ...state, description_loading: action.payload.description_loading };
    }
    case Types.SELLER_INFO_LOADING: {
      return { ...state, seller_info_loading: action.payload.seller_info_loading };
    }
    case Types.PAGE_LOADING: {
      return { ...state, page_loading: action.payload.page_loading };
    }
    case Types.ADDRESS_LOADING: {
      return { ...state, address_loading: action.payload.address_loading };
    }
    case Types.PLACE_LOADING: {
      return { ...state, place_loading: action.payload.place_loading };
    }
    default:
      return state;
  }
};
