import React, { useEffect, useState } from "react";
import _ from "lodash";
import { deleteCustomerAddress, getAllAddress } from "../../../utils/Services";
import { updatedShippingAddress } from "../../../utils/GlobalStateControl";
import AddEditAddressForm from "./AddEditAddressForm";
import swal from "sweetalert";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const AddressLists = (props) => {
  const { shipHereBtn, auth, newAddressAdded } = props;
  const [loading, setLoading] = useState(false);
  const [processDelete, setProcessDelete] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAddress, setEditAddress] = useState({});
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAllAddress(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      let addresses = response.addresses;
      if (!_.isEmpty(addresses)) {
        setAddressList(addresses);
      }
      setLoading(false);
    });
  }, [edit, processDelete, newAddressAdded, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  const selectShippingAddress = (e, address) => {
    e.preventDefault();
    updatedShippingAddress(address);
    props.setManageShipping(false);
  };

  const selectEditAddress = (e, address) => {
    e.preventDefault();
    setEdit(true);
    setEditAddress(address);
  };

  const deleteAddress = (e, address) => {
    e.preventDefault();
    swal({
      title: "Are you want to delete?",
      icon: "warning",
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        setProcessDelete(true);
        deleteCustomerAddress({
          id: address.id,
        }).then((response) => {
          setProcessDelete(false);
        });
      }
    });
  };

  if (edit) {
    return <AddEditAddressForm setEdit={setEdit} editAddress={editAddress} />;
  }

  return (
    <div className='row'>
      {loading ? (
        <div className='col-md-12  text-center py-5'>
          <div className='spinner-border text-secondary' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      ) : (
        addressList.length > 0 &&
        addressList.map((address, index) => (
          <div key={index} className='col-md-6'>
            <div className='card-body address_card'>
              <div className='card-header py-2'>
                <h6 className='d-inline'>Address #{index + 1}</h6>
                <div className='btn-toolbar d-inline float-right'>
                  <a
                    href={`/edit`}
                    onClick={(e) => selectEditAddress(e, address)}
                    className='btn btn-link d-inline'
                  >
                    Edit
                  </a>
                  <a
                    href={`/delete`}
                    onClick={(e) => deleteAddress(e, address)}
                    className='btn btn-link d-inline'
                  >
                    Delete
                  </a>
                </div>
              </div>
              <p>
                Name: {address.name}
                <br />
                Phone: {address.phone_one}
                <br />
                District: {address.phone_three}
                <br />
                Address: {address.address}
              </p>
              {shipHereBtn && (
                <a
                  href={`/ship-here`}
                  onClick={(e) => selectShippingAddress(e, address)}
                  className='btn_ship_here'
                >
                  Ship here
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(AddressLists));
