import _ from "lodash";
import * as Types from "./types";
import { axiosInstance, instanceAuthToken } from "../../utils/AxiosDefault";
import { configAttrToConfigured, setGlobalErrors } from "../../utils/GlobalStateControl";
import { in_loading, out_loading } from "../../utils/LoadingState";
import swal from "sweetalert";
import { destroyLocalCart } from "../../utils/CartHelpers";

export const loginWithEmailPassword = (data, history, loadCart) => (dispatch) => {
  axiosInstance
    .post("/login", data)
    .then((response) => {
      const responseData = response.data;

      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        const token = getData.token;
        const user = getData.user;
        const role = getData.role;

        if (_.isEmpty(user)) {
          swal({
            title: `${responseData.message.slice(0, 80)}`,
            icon: "warning",
            buttons: "Ok, Understood",
          });
        }
        if (!_.isEmpty(user)) {
          setGlobalErrors("");
          dispatch({
            type: Types.SET_USER,
            payload: {
              isAuthenticated: true,
              token: token,
              user: user,
              role: role,
            },
          });
          instanceAuthToken(token);
          window.localStorage.setItem("_auth", JSON.stringify(getData));
          loadCart();
          history.push("/dashboard");
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
      swal({
        title: `${error.response.data.message}`,
        icon: "warning",
        buttons: "Ok, Understood",
      });
    });
};

export const loginPhoneSubmitForOtp = (data) => (dispatch) => {
  in_loading();
  axiosInstance
    .post("/submit-for-otp", data)
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          dispatch({
            type: Types.OTP_SUBMIT,
            payload: {
              OTP_response: {
                status: getData.status,
                message: getData.status,
                data: getData.data,
              },
            },
          });
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

export const resendCustomerOTP = (data) => (dispatch) => {
  in_loading();
  axiosInstance
    .post("/resend-otp", data)
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          dispatch({
            type: Types.OTP_SUBMIT,
            payload: {
              OTP_response: {
                status: getData.status,
                message: getData.status,
                data: getData.data,
              },
            },
          });
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

export const submitCustomerOTP = (data, history) => (dispatch) => {
  in_loading();
  axiosInstance
    .post("/submit-otp", data)
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        const token = getData.token;
        const user = getData.user;
        if (!_.isEmpty(user)) {
          dispatch({
            type: Types.SET_USER,
            payload: {
              isAuthenticated: true,
              token: token,
              user: user,
              OTP_response: {},
            },
          });
          instanceAuthToken(token);
          window.localStorage.setItem("_auth", JSON.stringify(getData));
          history.push("/dashboard");
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

// social login
export const customerSocialLogin = (socialData, history, loadCart) => (dispatch) => {
  in_loading();
  axiosInstance
    .post("/social-login", { socialData: JSON.stringify(socialData) })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        const token = getData.token;
        const user = getData.user;
        const role = getData.role;
        if (!_.isEmpty(user)) {
          dispatch({
            type: Types.SET_USER,
            payload: {
              isAuthenticated: true,
              token: token,
              user: user,
              OTP_response: {},
              role: role,
            },
          });
          instanceAuthToken(token);
          window.localStorage.setItem("_auth", JSON.stringify(getData));
          loadCart();
          history.push("/dashboard");
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

export const backToLogin = () => (dispatch) => {
  dispatch({
    type: Types.OTP_SUBMIT,
    payload: {
      OTP_response: {
        status: false,
        message: "",
        data: [],
      },
    },
  });
};

export const authLogout = (history) => (dispatch) => {
  localStorage.removeItem("_auth");
  window.localStorage.removeItem("_shopAsCustomer");
  configAttrToConfigured([]);
  instanceAuthToken("");
  history.push("/login");
  dispatch({
    type: Types.SET_USER,
    payload: {
      isAuthenticated: false,
      user: {},
      token: false,
    },
  });
  dispatch({
    type: Types.SET_SHOP_USER,
    payload: {
      isShopAsCustomer: false,
      shopAsCustomer: {},
    },
  });
};

export const productAddToWishlist = (product, id, shopAsCustomer) => (dispatch) => {
  axiosInstance
    .post("/add-to-wishlist", { product: JSON.stringify(product), id, shopAsCustomer })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        dispatch({
          type: Types.WISHLIST,
          payload: {
            wishlist: getData.wishlists,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.WISHLIST,
        payload: {
          wishlist: [],
        },
      });
    });
};

export const customerWishlist = (id, shopAsCustomer) => (dispatch) => {
  axiosInstance
    .post("/get-wishlist", { id, shopAsCustomer })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        dispatch({
          type: Types.WISHLIST,
          payload: {
            wishlist: getData.wishlists,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.WISHLIST,
        payload: {
          wishlist: [],
        },
      });
    });
};

export const RemoveCustomerWishlist = (item_id, id, shopAsCustomer) => (dispatch) => {
  axiosInstance
    .post("/remove-wishlist", { item_id, id, shopAsCustomer })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        const getData = responseData.data;
        dispatch({
          type: Types.WISHLIST,
          payload: {
            wishlist: getData.wishlists,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.WISHLIST,
        payload: {
          wishlist: [],
        },
      });
    });
};
