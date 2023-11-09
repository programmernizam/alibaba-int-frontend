import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { authLogout, customerWishlist } from "../../../store/actions/AuthAction";
import { withRouter, NavLink, useHistory } from "react-router-dom";
import My404Component from "../../../pages/404/My404Component";
import { goPageTop } from "../../../utils/Helpers";
import { setShopAsSelf } from "../../../utils/GlobalStateControl";
import { loadCustomerCart } from "../../../store/actions/CartAction";

const Dashboard = (props) => {
  const { auth, loadCustomerCart } = props;
  const history = useHistory();
  const [section, setSection] = useState("dashboard");
  const newSection = props.match.params.section;

  useEffect(() => {
    goPageTop();
  }, []);

  useEffect(() => {
    if (newSection) {
      if (section !== newSection) {
        setSection(newSection);
        goPageTop();
      }
    }
  }, [section, newSection]);

  const authLogoutProcess = (e) => {
    e.preventDefault();
    props.authLogout(props.history);
  };

  const activeRoutes = [
    "dashboard",
    "account",
    "orders",
    "wishlist",
    "addresses",
    "account",
    "pending-orders",
    "processing-orders",
    "complete-orders",
    "refunded-orders",
    "shop-as-customer",
    "ready-to-delivered",
    "invoices",
  ];

  if (!activeRoutes.includes(section)) {
    return <My404Component />;
  }

  const handleShopAsSelf = async (user) => {
    setShopAsSelf(
      { isShopAsCustomer: null, shopAsCustomer: {} },
      history,
      loadCustomerCart,
      customerWishlist
    );
  };

  return (
    <aside>
    <div className='card bg-white'>
        <div className='card-body px-5 py-4'>
        <ul className='nav nav-dashboard flex-column mb-3 mb-md-0'>
            <li className='nav-item'>
            <NavLink to='/dashboard' exact className='nav-link'>
                Dashboard
            </NavLink>
            </li>
            <li className='nav-item'>
            <NavLink className='nav-link' to={`/dashboard/orders`}>
                My Orders
            </NavLink>
            </li>
            <li className='nav-item'>
            <NavLink className='nav-link' to={`/dashboard/invoices`}>
                Invoice's
            </NavLink>
            </li>
            <li className='nav-item'>
            <NavLink className='nav-link' to={`/dashboard/addresses`}>
                Addresses
            </NavLink>
            </li>
            <li className='nav-item'>
            <NavLink className='nav-link' to={`/dashboard/account`}>
                Account Details
            </NavLink>
            </li>
            {auth.role === "administrator" && (
            <li className='nav-item'>
                <NavLink className='nav-link' to={`/dashboard/shop-as-customer`}>
                Shop as customer
                </NavLink>
            </li>
            )}

            {/* {auth.shopAsCustomer.name && (
            <li>
                <p style={{ margin: 0 }}>
                Shopping as <span className='bold'>{auth.shopAsCustomer.name}</span>.{" "}
                <a className='return-link' onClick={() => handleShopAsSelf()}>
                    Return to your account
                </a>{" "}
                </p>
            </li>
            )} */}
            {auth.isShopAsCustomer && (
            <li>
                <a
                style={{ cursor: "pointer" }}
                onClick={() => handleShopAsSelf()}
                className='nav-link'
                >
                Shop as Self
                </a>
            </li>
            )}
            <li className='nav-item'>
            <a className='nav-link' onClick={(e) => authLogoutProcess(e)} href='/logout'>
                Sign Out
            </a>
            </li>
        </ul>
        </div>
    </div>
    </aside>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  authLogout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  auth: state.AUTH,
});

export default connect(mapStateToProps, { authLogout, loadCustomerCart, customerWishlist })(
  withRouter(Dashboard)
);
