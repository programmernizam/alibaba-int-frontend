import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import { authLogout, customerWishlist } from "../../store/actions/AuthAction";
import { withRouter, NavLink, useHistory } from "react-router-dom";
import SwitchSection from "./includes/SwitchSection";
import My404Component from "../../pages/404/My404Component";
import { goPageTop } from "../../utils/Helpers";
import { setShopAsSelf } from "../../utils/GlobalStateControl";
import { loadCustomerCart } from "../../store/actions/CartAction";

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
    <main className='main bg-gray'>
      <Breadcrumb current={section} collections={[{ name: "Dashboard", url: "dashboard" }]} />

      <div className='page-content'>
        <div className='dashboard'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <SwitchSection section={newSection ? newSection : "dashboard"} />
              </div>
              {/* End .col-lg-9 */}
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </div>
        {/* End .dashboard */}
      </div>
      {/* End .page-content */}
    </main>
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
