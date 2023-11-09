import React, { useEffect, useState } from "react";
import _ from "lodash";
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import {
  loginWithEmailPassword,
  loginPhoneSubmitForOtp,
  customerSocialLogin,
} from "../../store/actions/AuthAction";
import { Link, withRouter } from "react-router-dom";
import OTPSubmit from "./include/OTPSubmit";
import SocialButton from "./SocialButton";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { goPageTop } from "../../utils/Helpers";
import { useForm } from "react-hook-form";
import { loadCart } from "../../store/actions/CartAction";
import ForgotModal from "./include/ForgotModal";

const Login = (props) => {
  const { OTPResponse, isAuthenticated } = props;

  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
    }
    goPageTop();
  }, []);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });

        props.customerSocialLogin(res.data, props.history, props.loadCart);
      } catch (err) {}
    },
  });

  if (!_.isEmpty(OTPResponse)) {
    const status = OTPResponse.status;
    const data = OTPResponse.data;

    if (status && !_.isEmpty(data)) {
      return <OTPSubmit />;
    }
  }

  const handleSocialLogin = (user) => {
    props.customerSocialLogin(user, props.history, props.loadCart);
  };

  const handleSocialLoginFailure = (err) => {};

  const onSubmit = (data) => {
    props.loginWithEmailPassword(data, props.history, props.loadCart);
  };

  const closeModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      <main className='main'>
        <Breadcrumb current='Login' />
        <div className='login-page pb-8 pb-md-12 pt-lg-17 pb-lg-17'>
          <div className='container'>
            <div className='form-box'>
              <div className='form-tab'>
                <h1 className='text-center'>Login</h1>
                <div className='tab-content'>
                  <div
                    className='tab-pane fade show active'
                    id='otp_login'
                    role='tabpanel'
                    aria-labelledby='otp_login-tab'
                  >
                    <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
                      <div className='form-group'>
                        <label htmlFor='phone'>
                          Email <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='email'
                          className='form-control'
                          id='email'
                          required={true}
                          placeholder='Enter your email'
                          {...register("email", {
                            required: "Email Address is required",
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Please enter a valid email",
                            },
                          })}
                          aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && (
                          <p className='text-danger mb-0' role='alert'>
                            {errors.email?.message}
                          </p>
                        )}
                      </div>
                      <div className='form-group'>
                        <label htmlFor='password'>
                          Password <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='password'
                          className='form-control'
                          id='password'
                          required={true}
                          placeholder='Enter your password'
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Min 6 Characters",
                            },
                          })}
                          aria-invalid={errors.password ? "true" : "false"}
                        />
                        {errors.password && (
                          <p className='text-danger mb-0' role='alert'>
                            {errors.password?.message}
                          </p>
                        )}
                      </div>
                      <div className='form-footer mb-0'>
                        <button type='submit' className='btn py-2 btn-block btn-default'>
                          <span>SUBMIT</span>
                          <i className='icon-long-arrow-right' />
                        </button>
                      </div>

                      <p
                        className='text-right hi-color'
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => handleOpenModal()}
                      >
                        Forgot password?
                      </p>
                    </form>

                    <div className='form-choice'>
                      <p className='text-center mb-1'>
                        {" "}
                        Don`t have an account? <Link to='/signup'>Signup</Link>
                      </p>

                      <button className='btn btn-block btn-login mb-1' onClick={() => loginWithGoogle()}>
                        <span className='btn-g'>
                          <i className='icon-google' />
                        </span>{" "}
                        Login with google
                      </button>

                      <SocialButton
                        provider='facebook'
                        appId={process.env.REACT_APP_FACEBOOK_APP_KEY}
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                      >
                        <span className='btn-f'>
                          <i className='icon-facebook-f' />
                        </span>{" "}
                        Login with Facebook
                      </SocialButton>
                    </div>

                    {/* End .form-choice */}
                  </div>
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

      {openModal && <ForgotModal openModal={openModal} closeModal={closeModal} />}
    </>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  isAuthenticated: state.AUTH.isAuthenticated,
  OTPResponse: state.AUTH.OTP_response,
  cartConfigured: state.CART.configured,
  authError: state.ERRORS,
});

export default connect(mapStateToProps, {
  loginWithEmailPassword,
  loginPhoneSubmitForOtp,
  customerSocialLogin,
  loadCart,
})(withRouter(Login));
