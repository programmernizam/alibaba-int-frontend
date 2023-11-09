import _ from "lodash";
import * as Types from "./types";
import { CheckAndSetErrors, configAttrToConfigured, setGlobalErrors } from "../../utils/GlobalStateControl";
import { in_loading, out_loading, place_loading } from "../../utils/LoadingState";
import { axiosInstance } from "../../utils/AxiosDefault";
import { destroyLocalCart, storelocalCart } from "../../utils/CartHelpers";
import { shoAlert, showAlert } from "../../utils/Helpers";
import { createbKashPayment, executebKashPayment, getbKashToken } from "../../utils/Services";

export const loadCart = (id, shopAsCustomer) => (dispatch) => {
  in_loading();
  axiosInstance
    .get("/cart/get", {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((response) => {
      const responseData = response.data;

      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        if (!_.isEmpty(responseData)) {
          const cart = responseData.data.cart;
          if (!_.isEmpty(cart)) {
            const configured = JSON.parse(cart);

            dispatch({
              type: Types.SELECT_CONFIGURED,
              payload: {
                configured: configured,
              },
            });
            storelocalCart(configured);
          }
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.SELECT_CONFIGURED,
        payload: {
          configured: [],
        },
      });
      storelocalCart([]);
    })
    .then(() => {
      out_loading();
    });
};
export const loadCustomerCart = (id, shopAsCustomer) => (dispatch) => {
  in_loading();
  axiosInstance
    .get("/cart/get", {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((response) => {
      const responseData = response.data;

      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        if (!_.isEmpty(responseData)) {
          const cart = responseData.data.cart;
          if (!_.isEmpty(cart)) {
            const configured = JSON.parse(cart);
            dispatch({
              type: Types.SELECT_CONFIGURED,
              payload: {
                configured: configured,
              },
            });
            storelocalCart(configured);
          }
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.SELECT_CONFIGURED,
        payload: {
          configured: [],
        },
      });
      storelocalCart([]);
    })
    .then(() => {
      out_loading();
    });
};
export const addToOriginalCart = async (cart) => (dispatch) => {
  axiosInstance
    .put("/cart/update", {
      params: {
        cart: cart,
      },
    })
    .then((response) => {
      const responseData = response.data;

      // const noError = CheckAndSetErrors(responseData);
      // if (noError) {
      //   if (!_.isEmpty(responseData)) {
      //     const configured = responseData.configured;
      //     dispatch({
      //       type: Types.SELECT_CONFIGURED,
      //       payload: {
      //         configured: JSON.parse(configured),
      //       },
      //     });
      //     storelocalCart(configured);
      //   }
      // }
    })
    .catch((error) => {
      // setGlobalErrors(error.response);
    });
};

export const confirmCustomerOrder = (history, orderData) => (dispatch) => {
  place_loading(true);
  axiosInstance
    .post("/confirm-order", orderData)
    .then((response) => {
      const responseData = response.data;
      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        const getData = responseData.data;

        if (!_.isEmpty(getData)) {
          const payMethod = getData.payment_method;
          const payerReference = getData.payerReference;
          const amount = getData.amount;
          const invoice_number = getData.invoice_number;
          if (payMethod === "cash_payment") {
            destroyLocalCart();
            configAttrToConfigured([]);
            showAlert(
              "আপনার অর্ডারটি সফলভাবে সাবমিট হয়েছে,প্লিজ অর্ডার ভ্যালু ক্যাশ এ প্রদান করুন।",
              "success",
              "Ok, Understood"
            );
          } else if (payMethod === "bkash_payment") {
            destroyLocalCart();
            configAttrToConfigured([]);
            in_loading();
            getbKashToken().then((response) => {
              if (!_.isEmpty(response)) {
                const auth_token = response?.token;
                if (localStorage.getItem("bkash_token") !== null) {
                  localStorage.removeItem("bkash_token");
                }

                localStorage.setItem("bkash_token", auth_token);
                if (!_.isEmpty(auth_token)) {
                  createbKashPayment(auth_token, payerReference, amount, invoice_number).then((response) => {
                    if (!_.isEmpty(response)) {
                      const paymentID = response?.paymentID;
                      const bkashURL = response?.bkashURL;
                      if (!_.isEmpty(bkashURL)) {
                        window.location.assign(bkashURL);
                        // window.open(bkashURL, "_blank");
                        out_loading(false);
                      }
                    }
                  });
                }
              }
            });
          } else {
            const redirect = getData.redirect;
            if (redirect) {
              destroyLocalCart();
              configAttrToConfigured([]);
              history.push(redirect);
            }
          }

          if (getData.safsdfsadf !== undefined) {
            dispatch({
              type: Types.LOAD_FAKE,
              payload: {
                fake: {},
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
      place_loading(false);
    });
};

export const changesPaymentsStatusToConfirm = (orderData) => (dispatch) => {
  in_loading();
  axiosInstance
    .post("/payment-confirm", orderData)
    .then((response) => {
      const responseData = response.data;
      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          const redirect = getData.redirect;
          if (redirect) {
            window.location.assign(redirect);
          }
          if (getData.safsdfsadf !== undefined) {
            dispatch({
              type: Types.LOAD_FAKE,
              payload: {
                fake: {},
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
      out_loading();
    });
};
