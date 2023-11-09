import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import { resetPassword } from "../../../utils/Services";
import reset from "../../../assets/images/reset.png";

const ResetPassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const history = useHistory();
  const { token } = useParams();

  const onSubmit = (data) => {
    resetPassword(token, data).then((response) => {
      if (!_.isEmpty(response)) {
        const resData = response.data;
        if (!_.isEmpty(resData)) {
          if (resData.status === "success") {
            swal({
              title: `${resData.message}`,
              icon: "success",
              buttons: "Ok, Understood",
              timer: 2500,
            });
            setTimeout(() => {
              history.push("/login");
            }, 2500);
          } else {
            swal({
              title: `${resData.message}`,
              icon: "warning",
              buttons: "Ok, Understood",
            });
          }
        }
      } else {
        swal({
          title: `Something went wrong`,
          icon: "warning",
          buttons: "Ok, Understood",
        });
      }
    });
  };
  return (
    <main className='main'>
      <Breadcrumb current='Reset Password' />
      <div className='login-page py-5  pt-lg-7 pb-lg-7'>
        <div className='container'>
          <div className='form-box'>
            <div className='form-tab'>
              <div className='flexCenter align-items-center'>
                <img style={{ width: "60px" }} src={reset} alt='' />{" "}
                <h1 className='text-center ml-3 mt-1 '>Password</h1>
              </div>

              <div className='tab-content'>
                <div
                  className='tab-pane fade show active'
                  id='otp_login'
                  role='tabpanel'
                  aria-labelledby='otp_login-tab'
                >
                  <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                      <label htmlFor='password'>
                        New Password <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='password'
                        className='form-control'
                        id='password'
                        required={true}
                        placeholder='Enter your new password'
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
                  </form>

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

export default ResetPassword;
