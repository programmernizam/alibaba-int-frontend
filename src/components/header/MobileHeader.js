import React from "react";
import { loadAsset } from "../../utils/Helpers";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./Header";
import MobileSearchForm from "./includes/MobileSearchForm";
import { FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

const MobileHeader = (props) => {
  const { auth, total_wishlist, user, site_name, frontend_logo_menu } = props;

  return (
    <header className="header mobile_header sticky-top header-intro-clearance header-26">
      <div className="header-middle">
        <div className="container">
          <div className="header-left">
            <a href="/" className="logo">
              <img src={loadAsset(frontend_logo_menu)} alt={site_name} />
            </a>
          </div>

          <div className="header-right">
           
            <div className="header-dropdown-link">
              <div className="wishlist">
                <Link to="/pages/blog" title="Blog">
                  <div className="icon">
                    <span className="ml-2 fw-bold d-md-none d-inline nav-item-text">
                      Blog
                    </span>
                  </div>
                </Link>
              </div>
              {/* End .compare-dropdown */}
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
              <div className="wishlist">
                <Link to="/dashboard" id="cd1">
                  <div className="icon">
                    <FaRegUserCircle />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* End .header-right */}
        </div>
        {/* End .container */}
      </div>

      <MobileSearchForm />
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

export default MobileHeader;
