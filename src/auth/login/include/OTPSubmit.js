import React, {useEffect, useState} from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {resendCustomerOTP, submitCustomerOTP, backToLogin} from "../../../store/actions/AuthAction";
import {withRouter} from "react-router-dom";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";

const OtpSubmit = props => {
   const {OTPResponse} = props;
   const data = !_.isEmpty(OTPResponse) ? OTPResponse.data : {};
   const phone = !_.isEmpty(data) ? data.phone : '';

   const [otp, setOtp] = useState('');
   const [seconds, setSeconds] = useState(50);


   useEffect(() => {
      let interval = null;
      if (seconds > 0) {
         interval = setInterval(() => {
            setSeconds(seconds => seconds - 1);
         }, 1000);
      } else if (seconds === 0) {
         clearInterval(interval);
      }
      return () => clearInterval(interval);
   }, [seconds]);


   const backToLoginForm = (e) => {
      e.preventDefault();
      props.backToLogin();
   };

   const OTPResendForm = (e) => {
      e.preventDefault();
      props.resendCustomerOTP({phone: phone});
      setSeconds(50);
      setOtp('');
   };


   const submitOTP = (e) => {
      const otpCode = e.target.value;
      if (otpCode.length === 4) {
         props.submitCustomerOTP({phone: phone, otp_code: otpCode}, props.history);
      }
      setOtp(e.target.value);
   };


   return (
      <main className="main">
         <Breadcrumb current="Login"/>

         <div
            className="login-page pb-8 pb-md-12 pt-lg-17 pb-lg-17"
         >
            <div className="container">
               <div className="form-box">
                  <div className="form-tab">
                     <h1 className="text-center">Login</h1>
                     <ul className="nav nav-pills nav-fill" role="tablist">
                        <li className="nav-item">
                           <span
                              className="nav-link"
                           >
                              Submit your OTP
                           </span>
                        </li>
                     </ul>
                     <div className="tab-content">
                        <form onSubmit={e => OTPResendForm(e)}>
                           <div className="form-group">
                              <input
                                 type="number"
                                 className="form-control text-center"
                                 id="otp_code"
                                 value={otp}
                                 onChange={e => submitOTP(e)}
                                 minLength={1}
                                 maxLength={4}
                                 placeholder="----"
                              />
                           </div>
                           <div className="border-0 form-footer m-0 p-0">
                              <button
                                 type={seconds > 0 ? "button" : "submit"}
                                 className={`btn py-3 btn-block btn-default  ${seconds > 0 ? 'disabled' : ''}`}
                              >
                                 <span>Resend OTP {seconds > 0 && seconds}</span>
                              </button>

                              <a href="/back-to-login"
                                 onClick={e => backToLoginForm(e)}
                                 className="forgot-link">
                                 Back To Login
                              </a>
                           </div>
                           {/* End .form-footer */}
                        </form>
                     </div>
                     {/* End .tab-content */}
                  </div>
                  {/* End .form-tab */}
               </div>
               {/* End .form-box */}
            </div>
            {/* End .container */}
         </div>

      </main>
   );
};

OtpSubmit.propTypes = {
   general: PropTypes.object.isRequired,
   OTPResponse: PropTypes.object.isRequired,
   cartConfigured: PropTypes.array,
};


const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   OTPResponse: state.AUTH.OTP_response,
   cartConfigured: state.CART.configured
});


export default connect(mapStateToProps, {resendCustomerOTP, submitCustomerOTP, backToLogin})(
   withRouter(OtpSubmit)
);
