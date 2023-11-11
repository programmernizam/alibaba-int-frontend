import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import * as Types from "./store/actions/types";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./scss/Icon.scss";
import "./scss/App.scss";
import { instanceAuthToken } from "./utils/AxiosDefault";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './utils/index.css';

const auth = window.localStorage.getItem("_auth");
const shopAsCustomer = window.localStorage.getItem("_shopAsCustomer");

if (auth) {
  const authData = JSON.parse(auth);
  const token = authData.token;
  instanceAuthToken(token);
  store.dispatch({
    type: Types.SET_USER,
    payload: {
      isAuthenticated: true,
      token: token,
      user: authData.user,
      role: authData.role,
    },
  });
}

if (shopAsCustomer) {
  const customerData = JSON.parse(shopAsCustomer);
  store.dispatch({
    type: Types.SET_SHOP_USER,
    payload: {
      isShopAsCustomer: true,
      shopAsCustomer: customerData,
    },
  });
}

const general = window.localStorage.getItem("_general");
if (general) {
  store.dispatch({
    type: Types.LOAD_GENERAL,
    payload: {
      general: general,
    },
  });
}

// const configured = window.localStorage.getItem("_configured");
// if (configured) {
//   store.dispatch({
//     type: Types.SELECT_CONFIGURED,
//     payload: {
//       configured: JSON.parse(configured),
//     },
//   });
// }

ReactDOM.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_APP_KEY}>
      <App />
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById("app")
);

reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
