import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, withRouter} from "react-router-dom";
import {connect} from "react-redux";

const AuthRoute = ({component: Component, isAuthenticated, ...rest}) => {

  return (
      <Route
          {...rest}
          render={props =>
              isAuthenticated ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: "/login",
                        state: {from: props.location}
                      }}
                  />
              )
          }
      />
  );
};

AuthRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.object.isRequired,
  location: PropTypes.object
};


const mapStateToProps = (state) => ({
  isAuthenticated: state.AUTH.isAuthenticated
});

export default connect(mapStateToProps, {})(withRouter(AuthRoute));



