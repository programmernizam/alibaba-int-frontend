import _ from "lodash";
import * as Types from "./types";
import { setGlobalErrors } from "../../utils/GlobalStateControl";
import { banner_loading, category_loading, in_loading, out_loading } from "../../utils/LoadingState";
import { axiosInstance } from "../../utils/AxiosDefault";

export const loadGeneral = () => (dispatch) => {
  in_loading();
  axiosInstance
    .get("/general")
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          const general = getData.general;
          dispatch({
            type: Types.LOAD_GENERAL,
            payload: {
              general: getData.general,
            },
          });
          window.localStorage.setItem("_general", general);
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      out_loading();
    });
};

export const loadCategories = () => (dispatch) => {
  category_loading(true);
  axiosInstance
    .get("/categories")
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          dispatch({
            type: Types.LOAD_CATEGORIES,
            payload: {
              categories: getData.categories,
            },
          });
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      category_loading(false);
    });
};

export const loadBanners = () => (dispatch) => {
  banner_loading(true);
  axiosInstance
    .get("/banners")
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          dispatch({
            type: Types.LOAD_BANNER,
            payload: {
              banners: getData,
            },
          });
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      banner_loading(false);
    });
};
