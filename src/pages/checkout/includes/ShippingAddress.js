import React, { useState } from "react";
import AddEditAddressForm from "./AddEditAddressForm";
import AddressLists from "./AddressLists";

const ShippingAddress = (props) => {
  const { currentAddress, setManageShipping, manageShipping, auth } = props;
  const [newAddress, setNewAddress] = useState(false);

  const closeModal = () => {
    props.setManageShipping(false);
  };

  const addNewAddress = (e) => {
    e.preventDefault();
    setNewAddress(true);
  };

  return (
    <>
      <div
        className={`modal modal_custom fade ${manageShipping && "show"}`}
        style={manageShipping && { display: "block" }}
        tabIndex='-1'
        aria-labelledby='chooseAddressModalLabel'
        data-keyboard='true'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header p-4'>
              <h5 className='modal-title' id='chooseAddressModalLabel'>
                Your Shipping Address
                <a
                  href={`/add-new-address`}
                  onClick={(e) => addNewAddress(e)}
                  className='btn btn-link d-inline'
                >
                  Add New Address
                </a>
              </h5>
              <button
                type='button'
                onClick={() => closeModal()}
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>×</span>
              </button>
            </div>
            <div className='modal-body p-4 px-5'>
              {newAddress ? (
                <AddEditAddressForm setNewAddress={setNewAddress} currentAddress={currentAddress} />
              ) : (
                <AddressLists shipHereBtn={true} setManageShipping={setManageShipping} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingAddress;
