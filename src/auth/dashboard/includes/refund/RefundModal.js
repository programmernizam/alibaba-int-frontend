import React from "react";
import { useForm } from "react-hook-form";

const RefundModal = ({ openModal, setOpenModal, cartConfigured }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const closeModal = (e) => {
    e.preventDefault();
    setOpenModal(false);
  };

  const onSubmit = (data) => {};
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
              Update Profile
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
                <label htmlFor='district'>Name</label>
                <input
                  type='text'
                  id='fullName'
                  placeholder='Refund Reason '
                  className='form-control mb-0'
                  {...register("reason", { required: " Reason is required" })}
                />
                {errors.reason?.type === "required" && (
                  <p className='text-danger mb-0' role='alert'>
                    Reason is required
                  </p>
                )}
              </div>

              <hr />
              <div className='form-group text-right'>
                <button type='submit' className='btn btn-default mr-2'>
                  Confirm Refund
                </button>

                <button type='button' onClick={(e) => closeModal(e)} className='btn btn-secondary rounded'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
