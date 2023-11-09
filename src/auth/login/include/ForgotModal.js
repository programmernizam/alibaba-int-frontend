import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { forgotPasswordRequest } from "../../../utils/Services";

const ForgotModal = ({ openModal, closeModal }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    forgotPasswordRequest(data).then((response) => {
      if (!_.isEmpty(response)) {
        closeModal();
        const resData = response.data;
        if (!_.isEmpty(resData)) {
          if (resData.status === "success") {
            swal({
              title: `${resData.message}`,
              icon: "success",
              buttons: "Ok, Understood",
            });
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
    <div
      className={`modal modal_custom fade ${openModal && "show"}`}
      style={openModal && { display: "block" }}
      tabIndex='-1'
      aria-labelledby='chooseAddressModalLabel'
      data-keyboard='true'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-sm modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header p-4'>
            <h5 className='modal-title bold' id='chooseAddressModalLabel'>
              Forgot Password
            </h5>
            <button
              type='button'
              onClick={(e) => closeModal(e)}
              className='close'
              data-dismiss='modal'
              aria-label='Close'
            >
              <span aria-hidden='true'>×</span>
            </button>
          </div>
          <div className='modal-body p-4 px-5'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='form-group'>
                <label htmlFor='email'>
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

              <hr />
              <div className='form-group text-right'>
                <button
                  type='button'
                  onClick={(e) => closeModal(e)}
                  className='btn btn-secondary rounded mr-2'
                >
                  Cancel
                </button>
                <button type='submit' className='btn btn-default'>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotModal;
