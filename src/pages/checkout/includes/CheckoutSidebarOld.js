import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  cartCalculateDueToPay,
  cartCalculateNeedToPay,
  CheckoutSummary,
  numberWithCommas,
} from "../../../utils/CartHelpers";
import ShippingAddress from "./ShippingAddress";
import swal from "sweetalert";
import { getSetting } from "../../../utils/Helpers";
import { addAdvancePaymentPercent } from "../../../utils/GlobalStateControl";

const CheckoutSidebar = (props) => {
  const { general, currency, shipping_address, cartConfigured } = props;
  const chinaLocalShippingCharges = getSetting(general, "china_local_delivery_charge");
  const chinaLocalShippingChargeLimit = getSetting(general, "china_local_delivery_charge_limit");
  const summary = CheckoutSummary(cartConfigured, chinaLocalShippingCharges, chinaLocalShippingChargeLimit);
  const checkout_payment_first = getSetting(general, "checkout_payment_first");
  const checkout_payment_second = getSetting(general, "checkout_payment_second");
  const checkout_payment_third = getSetting(general, "checkout_payment_third");

  const [manageShipping, setManageShipping] = useState(false);
  const [paymentOption, setPaymentOption] = useState(Number(checkout_payment_first));

  const manageShippingAddress = (e) => {
    e.preventDefault();
    setManageShipping(true);
  };

  const ProcessToPaymentPage = () => {
    let proceed = true;
    if (_.isEmpty(shipping_address)) {
      proceed = false;
      swal({
        title: "Add your shipping  address first",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (!summary.totalPrice) {
      proceed = false;
      swal({
        title: "Please select your order Item",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }
    if (proceed) {
      props.history.push("/payment");
    }
  };

  const needToPay = () => {
    const price = cartCalculateNeedToPay(summary.totalPrice, paymentOption);
    return numberWithCommas(price);
  };

  const handlePaymentChange = (e) => {
    let percent = e.target.value;
    setPaymentOption(percent);
    addAdvancePaymentPercent(percent);
  };

  const dueAmount = () => {
    const price = cartCalculateDueToPay(summary.totalPrice, paymentOption);
    return numberWithCommas(price);
  };
  return (
    <aside className='col-lg-3'>
      {manageShipping && (
        <ShippingAddress
          currentAddress={shipping_address}
          manageShipping={manageShipping}
          setManageShipping={setManageShipping}
        />
      )}

      <div className='summary summary-cart'>
        <h3 className='summary-title'>Cart Total Summary</h3>
        <table className='table table-summary'>
          <tbody>
            <tr className='summary-total'>
              <td>Subtotal:</td>
              <td>{`${currency} ${numberWithCommas(summary.totalPrice)}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Need To Pay:</td>
              <td>{`${currency} ${needToPay()}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Due Amount:</td>
              <td>{`${currency} ${dueAmount()}`}</td>
            </tr>
            <tr className='summary-total'>
              <td>Select Payment Amount(%):</td>
              <div className='ml-2'>
                <select onChange={handlePaymentChange} className='form-control' name='' id='payment'>
                  <option value={checkout_payment_first}>{checkout_payment_first}%</option>
                  <option value={checkout_payment_second}>{checkout_payment_second}%</option>
                  <option value={checkout_payment_third}>{checkout_payment_third}%</option>
                </select>
              </div>
            </tr>

            <tr className='summary-shipping-estimate'>
              <td>
                Shipping Address{" "}
                <a href={"/shipping"} onClick={(e) => manageShippingAddress(e)} className='small'>
                  Choose
                </a>
              </td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className='text-left py-3'>
                <p className='mb-1'>Name: {shipping_address.name || "..."}</p>
                <p className='mb-1'>Phone: {shipping_address.phone_one || "..."}</p>
                <p className='mb-1'>District: {shipping_address.phone_three || "..."}</p>
                <p>{shipping_address.address || ""}</p>
              </td>
            </tr>
          </tbody>
        </table>
        {/* End .table table-summary */}
        <button type='button' onClick={(e) => ProcessToPaymentPage()} className='btn btn-block btn-default'>
          PROCEED TO CHECKOUT
        </button>
      </div>
    </aside>
  );
};

CheckoutSidebar.propTypes = {
  history: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  cartConfigured: PropTypes.array.isRequired,
  shipping_address: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  cartConfigured: state.CART.configured,
  shipping_address: state.CART.shipping_address,
});

export default connect(mapStateToProps, {})(withRouter(CheckoutSidebar));
