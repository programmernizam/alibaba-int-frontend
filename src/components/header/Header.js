import React from "react";
import PropTypes from "prop-types";
import { Link, useHistory, withRouter } from "react-router-dom";
import SearchForm from "./includes/SearchForm";
import { loadAsset } from "../../utils/Helpers";
import { FaShoppingCart, FaRegUserCircle } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { setShopAsSelf } from "../../utils/GlobalStateControl";
import { connect } from "react-redux";
import { loadCustomerCart } from "../../store/actions/CartAction";
import { customerWishlist } from "../../store/actions/AuthAction";

const Header = (props) => {
  const {
    auth,
    total_wishlist,
    user,
    site_name,
    frontend_logo_menu,
    loadCustomerCart,
  } = props;
  const history = useHistory();

  const handleShopAsSelf = async (user) => {
    setShopAsSelf(
      { isShopAsCustomer: null, shopAsCustomer: {} },
      history,
      loadCustomerCart,
      customerWishlist
    );
  };

  return (
    <header className="header header-intro-clearance header-26 shadow-0">
      <div className="header-middle">
        <div className="container">
          <div className="header-left">
            <Link to="/" className="logo">
              <img
                src={loadAsset(frontend_logo_menu)}
                alt={site_name}
                width={"60"}
                height={"40"}
              />
            </Link>
          </div>

          <div className="header-center">
            
            <SearchForm />
          </div>

          <div className="header-right">
            <div className="header-dropdown-link">
              <div className="wishlist">
                <Link to="/pages/blog">
                  <div className="icon">
                    <span className="ml-2 fw-bold d-md-inline d-none nav-item-text">
                      Blog
                    </span>
                  </div>
                </Link>
              </div>
              <div className="wishlist">
                <Link to="/checkout" title="Cart">
                  <div className="icon">
                    <FaShoppingCart />
                    <span className="wishlist-count badge">
                      {props.cartCount()}
                    </span>
                  </div>
                </Link>
              </div>
              <div className="wishlist">
                <Link to="/wishlist" title="Wishlist">
                  <div className="icon">
                    <FiHeart />
                    <span className="wishlist-count badge">
                      {total_wishlist}
                    </span>
                  </div>
                </Link>
              </div>

              {auth.isAuthenticated ? (
                <div className="dropdown cart-dropdown">
                  <Link
                    to="/dashboard"
                    className="dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-display="static"
                    id="cd1"
                  >
                    <div className="icon">
                      <FaRegUserCircle />
                      <span className="ml-2 fw-bold d-md-inline d-none nav-item-text">
                        {auth.isShopAsCustomer
                          ? auth.shopAsCustomer.name
                          : user?.name || "Customer"}
                        {/* {user?.name || "Customer"} */}
                      </span>
                    </div>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-right nav_customer_menus">
                    <Link to="/dashboard" className="dropdown-item">
                      Dashboard
                    </Link>
                    <Link to="/dashboard/orders" className="dropdown-item">
                      My Orders
                    </Link>
                    <Link to="/dashboard/account" className="dropdown-item">
                      Account
                    </Link>

                    {auth.role === "administrator" && (
                      <Link
                        to="/dashboard/shop-as-customer"
                        className="dropdown-item"
                      >
                        Shop as customer
                      </Link>
                    )}

                    {auth.isShopAsCustomer && auth.isShopAsCustomer && (
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => handleShopAsSelf()}
                        className="dropdown-item"
                      >
                        Shop as Self
                      </a>
                    )}

                    <a
                      href={`/logout`}
                      className="dropdown-item"
                      onClick={(e) => props.authLogoutProcess(e)}
                    >
                      Logout
                    </a>
                  </div>
                  {/* End .dropdown-menu */}
                </div>
              ) : (
                <div className="cart-dropdown">
                  <Link
                    to="/login"
                    className="dropdown-toggle"
                    role="button"
                    id="cd"
                  >
                    <div className="icon">
                      <FaRegUserCircle />
                      <span className="ml-2 fw-bold d-md-inline d-none nav-item-text">
                        Login
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* {auth.shopAsCustomer.name && (
        <div className='text-center'>
          <p style={{ margin: 0 }}>
            Currently shopping as <span className='bold'>{auth.shopAsCustomer.name}</span>.{" "}
            <a className='return-link' onClick={() => handleShopAsSelf()}>
              Return to your account
            </a>{" "}
          </p>
        </div>
      )} */}
    </header>
  );
};

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  site_name: PropTypes.string.isRequired,
  frontend_logo_menu: PropTypes.string.isRequired,
  authLogoutProcess: PropTypes.func.isRequired,
  cartCount: PropTypes.func.isRequired,
  total_wishlist: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { loadCustomerCart, customerWishlist })(
  withRouter(Header)
);
