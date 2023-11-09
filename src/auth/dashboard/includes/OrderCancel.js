import _ from "lodash";
import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { cancelOrder } from "../../../utils/Services";

const OrderCancel = ({ setOpenCancelModal, openCancelModal, orderId, setCancel, auth }) => {
  const [selectCancelReason, setSelectCancelReason] = useState("");
  const [inputReason, setInputReason] = useState("");
  const closeModal = (e) => {
    e.preventDefault();
    setOpenCancelModal(false);
  };

  const handleReasonChange = (e) => {
    setSelectCancelReason(e.target.value);
  };

  const handleCancelOrder = (e) => {
    e.preventDefault();
    let reason;
    if (selectCancelReason === "other") {
      reason = inputReason;
    } else {
      reason = selectCancelReason;
    }
    if (!reason) {
      swal({
        title: `Please Input Your Reason`,
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (reason) {
      swal({
        title: "Are you sure to cancel this order?",
        icon: "warning",
        buttons: ["No, cancel it!", "Yes, I am sure!"],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (isConfirm) {
          cancelOrder(orderId, reason, auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
            if (!_.isEmpty(response)) {
              const resData = response.data;
              if (!_.isEmpty(resData)) {
                if (resData.status === "success") {
                  setCancel(true);
                  setOpenCancelModal(false);
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
            }
          });
        } else {
        }
      });
    }
  };

  return (
    <div
      className={`modal modal_custom fade ${openCancelModal && "show"}`}
      style={openCancelModal && { display: "block" }}
      tabIndex='-1'
      aria-labelledby='chooseAddressModalLabel'
      data-keyboard='true'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-sm modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header p-4'>
            <h5 className='modal-title bold' id='chooseAddressModalLabel'>
              Cancel order
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
            <form onSubmit={handleCancelOrder}>
              <div className='form-group'>
                <label htmlFor='district'>Select reason</label>
                <select onChange={handleReasonChange} className='form-control' name='' id='payment'>
                  <option value={0}>select</option>
                  <option value={"Not interested anymore"}>Not interested anymore</option>
                  <option value={"Change of mind"}>Change of mind</option>
                  <option value={"Found better deals"}>Found better deals</option>
                  <option value='other'>Other</option>
                </select>
              </div>
              {selectCancelReason === "other" && (
                <div className='form-group'>
                  <input
                    onChange={(e) => setInputReason(e.target.value)}
                    id='phone'
                    placeholder='Enter Reason'
                    className='form-control mb-0'
                    required={true}
                  />
                </div>
              )}
              <hr />
              <div className='form-group text-right'>
                <button type='submit' className='btn btn-default mr-2'>
                  Cancel order
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

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(OrderCancel));
