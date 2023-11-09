import React, { useEffect, useState } from "react";
import AddEditAddressForm from "../../../pages/checkout/includes/AddEditAddressForm";
import AddressLists from "../../../pages/checkout/includes/AddressLists";
import { goPageTop } from "../../../utils/Helpers";
// import PropTypes from 'prop-types';

const AddressBook = (props) => {
  const [newAddress, setNewAddress] = useState(false);
  const [newAddressAdded, setNewAddressAdded] = useState(false);

  useEffect(() => {
    goPageTop();
  }, [newAddress]);

  const closeModal = () => {
    setNewAddress(false);
  };

  const addNewAddress = (e) => {
    e.preventDefault();
    setNewAddress(true);
  };

  return (
    <>
      <div className='card'>
        <div className='card-header border border-bottom-0 p-4'>
          <h4 className='card-title flexBetween align-items-center'>
            Address Book{" "}
            <a href={`/add-new-address`} onClick={(e) => addNewAddress(e)} className='btn btn-link d-inline'>
              Add New Address
            </a>
          </h4>
        </div>
        <div className='card-body border p-4'>
          <AddressLists newAddressAdded={newAddressAdded} shipHereBtn={false} />
        </div>
      </div>
      {newAddress && (
        <div
          className={`modal modal_custom fade ${setNewAddress && "show"}`}
          style={setNewAddress && { display: "block" }}
          tabIndex='-1'
          aria-labelledby='chooseAddressModalLabel'
          data-keyboard='true'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-sm modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header p-4'>
                <h5 className='modal-title bold' id='chooseAddressModalLabel'>
                  Add New Shipping Address
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
                <AddEditAddressForm setNewAddress={setNewAddress} setNewAddressAdded={setNewAddressAdded} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// MyAccount.propTypes = {
//
// };

export default AddressBook;
