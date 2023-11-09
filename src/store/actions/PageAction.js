import {axiosInstance} from "../../utils/AxiosDefault";
import _ from 'lodash';
import * as Types from "./types";
import {CheckAndSetErrors, setGlobalErrors} from "../../utils/GlobalStateControl";
import {in_loading, out_loading} from "../../utils/LoadingState";


export const loadFaqPages = () => (dispatch) => {
  in_loading();
  axiosInstance.get("/faqs")
      .then((response) => {
        const responseData = response.data;
        if (!_.isEmpty(responseData)) {
          const getData = responseData.data;
          if (!_.isEmpty(getData)) {
            dispatch({
              type: Types.LOAD_FAQ,
              payload: {
                faqs: getData.faqs,
              },
            });
          }
        }
      })
      .catch((error) => {
        setGlobalErrors(error.response);
      })
      .then(() => {
        out_loading()
      });
};


export const loadContactPage = () => (dispatch) => {
  in_loading();
  axiosInstance.get("/contact-us")
      .then((response) => {
        const responseData = response.data;
        const noError = CheckAndSetErrors(responseData, true);
        if (noError) {
          const getData = responseData.data;
          if (!_.isEmpty(getData)) {
            dispatch({
              type: Types.LOAD_CONTACT,
              payload: {
                contact: getData.contact,
              },
            });
          }
        }
      })
      .catch((error) => {
        setGlobalErrors(error.response);
      })
      .then(() => {
        out_loading()
      });
};

export const loadSinglePage = (pages, slug) => (dispatch) => {
  in_loading();
  axiosInstance.get(`/single-page/${slug}`)
      .then((response) => {
        const responseData = response.data;
        const noError = CheckAndSetErrors(responseData, true);
        if (noError) {
          const getData = responseData.data;
          if (!_.isEmpty(getData)) {
            const singles = _.isObject(getData.singles) ? getData.singles : {};
            if (!_.isEmpty(singles)) {
              dispatch({
                type: Types.LOAD_SINGLE,
                payload: {
                  singles: [...pages, getData.singles],
                },
              });
            }
          }
        }
      })
      .catch((error) => {
        setGlobalErrors(error.response);
      })
      .then(() => {
        out_loading()
      });
};