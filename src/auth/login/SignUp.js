import React, { useEffect } from "react";
import _ from "lodash";
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import { loginPhoneSubmitForOtp, customerSocialLogin } from "../../store/actions/AuthAction";
import { Link, useHistory, withRouter } from "react-router-dom";
import OTPSubmit from "./include/OTPSubmit";
import SocialButton from "./SocialButton";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

import { goPageTop } from "../../utils/Helpers";
import { useForm } from "react-hook-form";
import { signupWithEmailPassword } from "../../utils/Services";
import swal from "sweetalert";

const SignUp = (props) => {
  const { OTPResponse, isAuthenticated } = props;

  const history = useHistory();
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

        props.customerSocialLogin(res.data, props.history);
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
    props.customerSocialLogin(user, props.history);
  };

  const handleSocialLoginFailure = (err) => {};

  const onSubmit = (data) => {
    data.name = `${data.fName} ${data.lName}`;
    signupWithEmailPassword(data).then((response) => {
      if (!_.isEmpty(response)) {
        if (!_.isEmpty(response)) {
          if (response.message) {
            swal({
              title: `${response.message}`,
              icon: "success",
              buttons: "Ok, Understood",
            });
            setTimeout(() => {
              history.push("/login");
            }, 4000);
          } else {
            swal({
              title: `${response.data.errors.email[0]}`,
              icon: "warning",
              buttons: "Ok, Understood",
            });
          }
        }
      }
    });
  };
  return (
    <main className='main'>
      <Breadcrumb current='Signup' />
      <div className='login-page pb-8 pb-md-12 pt-lg-17 pb-lg-17'>
        <div className='container'>
          <div className='form-box'>
            <div className='form-tab'>
              <h1 className='text-center'>Signup</h1>
              <div className='tab-content'>
                <div
                  className='tab-pane fade show active'
                  id='otp_login'
                  role='tabpanel'
                  aria-labelledby='otp_login-tab'
                >
                  <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                      <label htmlFor='fName'>
                        First Name <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='fName'
                        required={true}
                        placeholder='Enter your First name'
                        {...register("fName", {
                          required: "First name is required",
                        })}
                        aria-invalid={errors.fName ? "true" : "false"}
                      />
                      {errors.fName && (
                        <p className='text-danger mb-0' role='alert'>
                          {errors.fName?.message}
                        </p>
                      )}
                    </div>
                    <div className='form-group'>
                      <label htmlFor='c'>
                        Last Name <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='lName'
                        required={true}
                        placeholder='Enter your Last name'
                        {...register("lName", {
                          required: "Last name is required",
                        })}
                        aria-invalid={errors.lName ? "true" : "false"}
                      />
                      {errors.lName && (
                        <p className='text-danger mb-0' role='alert'>
                          {errors.lName?.message}
                        </p>
                      )}
                    </div>
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
                    <div className='form-footer'>
                      <button type='submit' className='btn py-2 btn-block btn-default'>
                        <span>SUBMIT</span>
                        <i className='icon-long-arrow-right' />
                      </button>
                    </div>
                  </form>

                  <div className='form-choice'>
                    <p className='text-center mb-1'>
                      Already have an account? <Link to='/login'>Login</Link>
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
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  isAuthenticated: state.AUTH.isAuthenticated,
  OTPResponse: state.AUTH.OTP_response,
  cartConfigured: state.CART.configured,
  authError: state.ERROR,
});

export default connect(mapStateToProps, {
  loginPhoneSubmitForOtp,
  customerSocialLogin,
})(withRouter(SignUp));
