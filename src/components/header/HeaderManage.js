import React, { useEffect, useState } from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import { connect } from "react-redux";
import { loadCategories, loadGeneral } from "../../store/actions/InitAction";
import { authLogout, customerWishlist } from "../../store/actions/AuthAction";
import { withRouter } from "react-router-dom";
import { getSetting, useWindowSize } from "../../utils/Helpers";
import _ from "lodash";
import PropTypes from "prop-types";
import { loadCart } from "../../store/actions/CartAction";

const HeaderManage = (props) => {
  const { wishlist, general, auth, cartConfigured } = props;
  const total_wishlist = _.isArray(wishlist) ? wishlist.length : 0;
  const [loading, setLoading] = useState(false);

  let [width] = useWindowSize();

  width = width ? width : window.innerWidth;

  const user = auth.user;
  const site_name = getSetting(general, "site_name");
  const frontend_logo_menu = getSetting(general, "frontend_logo_menu", "/assets/demos/logo.png");

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      props.loadCategories();
      props.loadGeneral();

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      props.customerWishlist(auth.shopAsCustomer.id, auth.isShopAsCustomer);
      props.loadCart(auth.shopAsCustomer.id, auth.isShopAsCustomer);
      setLoading(false);
    }
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer, auth.isAuthenticated]);

  const cartCount = () => {
    if (_.isArray(cartConfigured)) {
      const itemCount = cartConfigured.filter((filter) => filter.IsCart === true);
      return !_.isEmpty(itemCount) ? itemCount.length : 0;
    }
    return 0;
  };

  const authLogoutProcess = (e) => {
    e.preventDefault();
    props.authLogout(props.history);
  };

  if (width <= 751) {
    return (
      <MobileHeader
        auth={auth}
        user={user}
        site_name={site_name}
        total_wishlist={total_wishlist}
        frontend_logo_menu={frontend_logo_menu}
        authLogoutProcess={authLogoutProcess}
        cartCount={cartCount}
      />
    );
  }

  return (
    <Header
      auth={auth}
      user={user}
      site_name={site_name}
      total_wishlist={total_wishlist}
      frontend_logo_menu={frontend_logo_menu}
      authLogoutProcess={authLogoutProcess}
      cartCount={cartCount}
    />
  );
};

HeaderManage.propTypes = {
  customerWishlist: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  auth: state.AUTH,
  wishlist: state.AUTH.wishlist,
  categories: state.INIT.categories,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {
  loadCategories,
  loadGeneral,
  authLogout,
  customerWishlist,
  loadCart,
})(withRouter(HeaderManage));
