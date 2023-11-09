import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const MyAccount = (props) => {
  const { user } = props;
  return (
    <div className='card'>
      <div className='card-header'>
        <h4 className='card-title'>My Account</h4>
      </div>
      <div className='card-body'>
        <h6>Account Information</h6>
        <hr />
        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow-none'>
              <div className='card-body px-0'>
                <h6>Contact Information</h6>
                <p className='m-0'>{`${user.firstname} ${user.lastname}`}</p>
                <p className='m-0'>{user.email}</p>
                <p>
                  <a href='#!' className='btn-link small'>
                    Edit
                  </a>
                  <span className='mx-2'>|</span>
                  <a href='#!' className='btn-link small'>
                    Change Password
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card shadow-none'>
              <div className='card-body px-0'>
                <h6>Newsletters</h6>
                <p className='m-0'>{`You aren't subscribed to our newsletter.`}</p>
                <p>
                  <a href='#!' className='btn-link small'>
                    Edit
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <h6>
          Address Book{" "}
          <Link to='/dashboard/address' className='btn-link small ml-3'>
            Manage Addresses
          </Link>
        </h6>
        <hr />
        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow-none'>
              <div className='card-body px-0'>
                <h6>Default Billing Address</h6>
                <p className='m-0'>You have not set a default billing address.</p>
                <p>
                  <a href='#!' className='btn-link small'>
                    Edit
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card shadow-none'>
              <div className='card-body px-0'>
                <h6>Default Shipping Address</h6>
                <p className='m-0'>{`You have not set a default shipping address.`}</p>
                <p>
                  <a href='#!' className='btn-link small'>
                    Edit
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MyAccount.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.AUTH.user,
});

export default connect(mapStateToProps, {})(withRouter(MyAccount));
