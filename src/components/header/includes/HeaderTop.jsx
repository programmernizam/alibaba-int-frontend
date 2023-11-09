import React, {useEffect} from 'react';
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {loadGeneral} from "../../../store/actions/InitAction";
import _ from "lodash";
import PropTypes from "prop-types";
import {authLogout} from "../../../store/actions/AuthAction";

const HeaderTop = props => {
  const {general, auth, banners} = props;
  const office_phone = general.office_phone ? general.office_phone : '...';

  const user = auth.user;

  useEffect(() => {
    if (_.isEmpty(banners)) {
      props.loadGeneral();
    }
  }, []);

  const authLogoutProcess = (e) => {
    e.preventDefault();
    props.authLogout(props.history);
  };


  return (
      <div className="header-top">
        <div className="container">
          <div className="header-left">
            <a href={`tel: ${office_phone}`} className="font-weight-normal">
              <i className="icon-phone h6 second-primary-color"/>
              Call: {office_phone}
            </a>
          </div>
          <div className="header-right font-weight-normal">
            <ul className="top-menu">
              <li>
                <ul>
                  <li>
                    <div className="header-dropdown">
                      <a href="#!">English</a>
                      <div className="header-menu">
                        <ul>
                          <li>
                            <a href="#!">English</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  {
                    auth.isAuthenticated ?
                        <li>
                          <div className="header-dropdown">
                            <a href="#!">{user.name || "Customer"}</a>
                            <div className="header-menu">
                              <ul>
                                <li>
                                  <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li>
                                  <Link to="/orders">My Orders</Link>
                                </li>
                                <li>
                                  <Link to="/account">Account</Link>
                                </li>
                                <li>
                                  <a href="/logout" onClick={e => authLogoutProcess(e)}>Logout</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                        :
                        <li>
                          <Link to="/login" data-toggle="modal">
                            Login
                          </Link>
                        </li>
                  }

                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
};

HeaderTop.propTypes = {
  general: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  authLogout: PropTypes.func.isRequired,
  banners: PropTypes.array
};


const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  auth: state.AUTH,
  banners: state.INIT.banners,
});

export default connect(mapStateToProps, {loadGeneral, authLogout})(
    withRouter(HeaderTop)
);