import { setGlobalErrors, CheckAndSetErrors } from "../../utils/GlobalStateControl";
import {
  cat_product_loading,
  product_details_loading,
  search_product_loading,
} from "../../utils/LoadingState";
import { axiosInstance } from "../../utils/AxiosDefault";
import _ from "lodash";
import * as Types from "./types";
import { slugToKey } from "../../utils/Helpers";

export const loadProductDetails = (product, OldDetails) => (dispatch) => {
  const noNeedLoad = !_.isEmpty(product) && _.isObject(product);

  if (noNeedLoad) {
    dispatch({
      type: Types.LOAD_PRODUCT_DETAILS,
      payload: {
        product_details: [...OldDetails, product],
      },
    });
  } else {
    product_details_loading(true);
    axiosInstance
      .get(`/product/${product}`)
      .then((response) => {
        const responseData = response.data;
        const noError = CheckAndSetErrors(responseData, true);
        if (noError) {
          const getData = responseData.data;
          if (!_.isEmpty(getData)) {
            const newProduct = getData.item;
            const filterOldDetails = OldDetails.filter((filter) => filter.Id !== newProduct.Id);
            dispatch({
              type: Types.LOAD_PRODUCT_DETAILS,
              payload: {
                product_details: [...filterOldDetails, newProduct],
              },
            });
          }
        }
      })
      .catch((error) => {
        setGlobalErrors(error.response);
      })
      .then(() => {
        product_details_loading(false);
      });
  }
};

export const prepareSearching = (data, history) => (dispatch) => {
  product_details_loading(true);
  axiosInstance
    .post(`/search-process`, data)
    .then((response) => {
      const responseData = response.data;
      const noError = CheckAndSetErrors(responseData, true);
      if (noError) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          if (getData.search_id) {
            history.push(`/search/${getData.search_id}`);
          }
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      product_details_loading(false);
    });
};

export const getSearchProducts = (search_id, searchData) => (dispatch) => {
  search_product_loading(true);
  axiosInstance
    .get(`/get-search-result/${search_id}`)
    .then((response) => {
      const responseData = response.data;
      const noError = CheckAndSetErrors(responseData, true);
      if (noError) {
        const getData = responseData.data;
        const category_key = slugToKey(search_id);
        if (!_.isEmpty(getData)) {
          const products = JSON.parse(getData.products);

          const Content = !_.isEmpty(products) ? products.Content : [];
          const TotalCount = !_.isEmpty(products) ? products.TotalCount : 0;
          // dispatch({
          //   type: Types.LOAD_SEARCH_PRODUCTS,
          //   payload: {
          //     search_products: {
          //       ...searchData,
          //       [category_key]: {
          //         Content: JSON.stringify(Content),
          //         TotalCount: TotalCount,
          //       },
          //     },
          //   },
          // });
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      search_product_loading(false);
    });
};
