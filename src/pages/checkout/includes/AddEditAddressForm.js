import React, { useEffect, useState } from "react";
import _ from "lodash";
import swal from "sweetalert";
import { storeNewAddress } from "../../../utils/Services";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const AddEditAddressForm = (props) => {
  const { editAddress, auth, setNewAddressAdded } = props;

  const [Id, setId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!_.isEmpty(editAddress)) {
      setId(editAddress.id);
      setName(editAddress.name);
      setPhone(editAddress.phone_one);
      setDistrict(editAddress.phone_three);
      setAddress(editAddress.address);
    }
  }, []);

  const submitShippingAddress = (e) => {
    e.preventDefault();
    let proceed = true;
    if (!phone.match(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)) {
      proceed = false;
      swal({
        title: "Please provide a valid phone number!",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (!name || !phone || !district || !address) {
      proceed = false;
      swal({
        title: "All Address fields are required!",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }

    if (proceed) {
      storeNewAddress({
        id: Id,
        name: name,
        phone: phone,
        district: district,
        address: address,
        authId: auth.shopAsCustomer.id,
        shopAsCustomer: auth.isShopAsCustomer,
      }).then((response) => {
        if (response.status) {
          cancelAddEditAddress();
          if (setNewAddressAdded) setNewAddressAdded(true);
          swal({
            title: `Address ${Id ? "updated" : "added"} successfully`,
            icon: "success",
            buttons: "Ok, Understood",
            timer: 2000,
          });
        } else {
          swal({
            title: `Something went wrong!`,
            icon: "warning",
            buttons: "Ok, Understood",
            timer: 2000,
          });
        }
      });
    }
  };

  const cancelAddEditAddress = () => {
    if (Id) {
      props.setEdit(false);
    } else {
      props.setNewAddress(false);
    }
  };

  return (
    <form onSubmit={(e) => submitShippingAddress(e)}>
      <input type='hidden' value={Id} />
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your Name'
          required={true}
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='phone'>Phone</label>
        <input
          type='text'
          id='phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder='Your Phone'
          required={true}
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='district'>District</label>
        <input
          type='text'
          id='district'
          value={district}
          placeholder='You District'
          required={true}
          onChange={(e) => setDistrict(e.target.value)}
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='address'>Full Address</label>
        <input
          type='text'
          id='address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required={true}
          placeholder='You Address'
          className='form-control'
        />
      </div>

      <div className='form-group text-right'>
        <button
          type='button'
          onClick={() => cancelAddEditAddress()}
          className='btn btn-secondary rounded mr-2'
        >
          Cancel
        </button>
        <button type='submit' className='btn btn-default '>
          Save Address
        </button>
      </div>
    </form>
  );
};

AddEditAddressForm.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(AddEditAddressForm));
