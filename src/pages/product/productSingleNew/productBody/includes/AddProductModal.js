import React from "react";
import { Link } from "react-router-dom";
import { GrLinkPrevious } from "react-icons/gr";
import { BsFillCartDashFill } from "react-icons/bs";

const AddProductModal = (props) => {
  const { addSuccess, setAddSuccess } = props;
  const closeModal = (e) => {
    e.preventDefault();
    setAddSuccess(false);
  };
  return (
    <>
      <div
        className={`modal modal_custom fade ${addSuccess && "show"}`}
        style={addSuccess && { display: "block" }}
        tabIndex='-1'
        aria-labelledby='chooseAddressModalLabel'
        data-keyboard='true'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-sm modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-body p-4 px-5'>
              <h5 className='modal-title bold' id='chooseAddressModalLabel'>
                Success
                {/* Product added to cart successfully */}
              </h5>
              <p>Product added to cart successfully</p>
              <div className='flex flexEnd'>
                <span
                  style={{ cursor: "pointer" }}
                  className='mx-1'
                  onClick={(e) => closeModal(e)}
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span className='homeLogin-btn success-m-btn'>
                    <i className='icon-arrow-left mr-1'></i>
                    Continue Shopping
                  </span>
                </span>

                <Link to='/checkout' className='mx-1'>
                  <span className='homeLogin-btn success-m-btn'>
                    <i className='icon-shopping-cart mr-1'></i>
                    Go to cart
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
