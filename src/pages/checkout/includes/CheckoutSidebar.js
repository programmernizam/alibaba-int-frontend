import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import {
  calculateDiscountAmount,
  cartCalculateCouponDiscount,
  cartCalculateDiscount,
  cartCalculateDueToPay,
  cartCalculateNeedToPay,
  CheckoutSummary,
  numberWithCommas,
  reFinalCart,
  updateAddStoredCart,
} from "../../../utils/CartHelpers";
import ShippingAddress from "./ShippingAddress";
import swal from "sweetalert";
import { getSetting } from "../../../utils/Helpers";
import {
  addAdvancePaymentPercent,
  addCouponDetails,
  selectPaymentMethod,
} from "../../../utils/GlobalStateControl";
import { getCouponDetails, getUserInfo } from "../../../utils/Services";
import { confirmCustomerOrder } from "../../../store/actions/CartAction";
import bakhsImg from "../../../assets/images/payment/bkash_logo.png";
import nagadImg from "../../../assets/images/payment/nagad.png";
import bankImg from "../../../assets/images/payment/card.png";

const CheckoutSidebar = (props) => {
  const { general, currency, shipping_address, cartConfigured, advance_percent, auth, place_loading } = props;
  const chinaLocalShippingCharges = Number(getSetting(general, "china_local_delivery_charge"));
  const chinaLocalShippingChargeLimit = Number(getSetting(general, "china_local_delivery_charge_limit"));
  const summary = CheckoutSummary(cartConfigured, chinaLocalShippingCharges, chinaLocalShippingChargeLimit);
  const checkout_payment_first = getSetting(general, "checkout_payment_first");
  const checkout_payment_second = getSetting(general, "checkout_payment_second");
  const checkout_payment_third = getSetting(general, "checkout_payment_third");
  const checkout_payment_fourth = getSetting(general, "checkout_payment_fourth");
  const minOrderPrice = getSetting(general, "min_order_amount");
  const minOrderQuantity = getSetting(general, "min_order_quantity");
  const role = auth.user.roles[0].name || "user";
  const history = useHistory();
  const [manageShipping, setManageShipping] = useState(false);
  const [paymentOption, setPaymentOption] = useState(Number(checkout_payment_third));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponDetails, setCouponDetails] = useState({});
  const [refNumber, setRefNumber] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    getUserInfo(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      if (!_.isEmpty(response)) {
        const user = response.data.user;
        if (!_.isEmpty(user)) {
          setUser(user);
        }
      }
    });
  }, []);

  useEffect(() => {
    const uniqueRef = Date.now();
    setRefNumber(uniqueRef);
  }, []);

  useEffect(() => {
    setPaymentOption(checkout_payment_third);
    addAdvancePaymentPercent(checkout_payment_third);
  }, []);

  const manageShippingAddress = (e) => {
    e.preventDefault();
    setManageShipping(true);
  };

  const handlePaymentChange = (e) => {
    let percent = e.target.value;
    setPaymentOption(percent);
    addAdvancePaymentPercent(percent);
  };
  const handlePaymentMethodChange = (e) => {
    let method = e.target.value;
    if (method) setPaymentMethod(method);
    selectPaymentMethod(method);
  };

  const getDiscount = () => {
    let discount = 0;
    if (paymentMethod && paymentOption) {
      if (paymentMethod == "bank_payment")
        discount = calculateDiscountAmount(paymentMethod, paymentOption, general, "bank");
      if (paymentMethod == "bkash_payment")
        discount = calculateDiscountAmount(paymentMethod, paymentOption, general, "bkash");
      if (paymentMethod == "nagad_payment")
        discount = calculateDiscountAmount(paymentMethod, paymentOption, general, "nagad");
    }
    return discount;
  };

  const coupon_amount = couponDetails?.coupon_amount;
  const coupon_type = couponDetails?.coupon_type;
  const couponDiscount = cartCalculateCouponDiscount(couponDetails, summary.totalPrice);
  const discountPercent = coupon_amount ? 0 : getDiscount();

  const advanced = cartCalculateNeedToPay(summary.totalPrice, Number(advance_percent));
  const dueAmount = cartCalculateDueToPay(summary.totalPrice, Number(advance_percent));
  const discountAmount = cartCalculateDiscount(advanced, discountPercent);

  const getInitAmountWithoutDiscount = (totalPrice, discountAmount, couponDiscount) => {
    const totalDiscount = discountAmount + Number(couponDiscount);
    return totalPrice - totalDiscount;
  };

  const finalCart = reFinalCart(cartConfigured, chinaLocalShippingChargeLimit, chinaLocalShippingCharges);

  // const finalCart = () => {
  //   let modified = reConfigCart.map((mapItem) => {
  //     let ConfiguredItems = mapItem.ConfiguredItems.map((mapConfig) =>
  //       mapConfig.isChecked ? mapConfig : { notFound: true }
  //     );
  //     ConfiguredItems = ConfiguredItems.filter((filter) => filter.notFound !== true);
  //     if (ConfiguredItems.length > 0) {
  //       return { ...mapItem, ConfiguredItems: ConfiguredItems };
  //     }
  //     return { ...mapItem };
  //   });
  //   return (modified = modified.filter((filter) => filter.notFound !== true));
  // };

  const handleCouponApply = () => {
    if (!coupon) {
      swal({
        title: "Please Enter Your Coupon",
        icon: "warning",
        buttons: "Ok, Understood",
      });
      return;
    }

    getCouponDetails(coupon, summary.totalPrice, auth.shopAsCustomer.id, auth.isShopAsCustomer).then(
      (response) => {
        if (!_.isEmpty(response)) {
          const resData = response.data;
          if (!_.isEmpty(resData)) {
            const coupon = resData.coupon;
            if (!_.isEmpty(coupon)) {
              setCouponDetails(coupon);
              addCouponDetails(coupon);
            }
          } else {
            const errorMessage = response.message ? response.message : "Invalid Coupon!";
            swal({
              title: `${errorMessage}`,
              icon: "warning",
              buttons: "Ok, Understood",
            });
          }
        }
      }
    );
  };

  const handlePlaceOrder = () => {
    let proceed = true;

    cartConfigured.map((item) => {
      if (item.totalPrice < minOrderPrice) {
        proceed = false;
        swal({
          text: `Dear customer, Every product should be ordered for a minimum of ${minOrderQuantity} pieces and ${minOrderPrice} taka! ${`\n \n`} (সম্মানিত গ্রাহক যেকোন পণ্য সর্বনিম্ন ${minOrderQuantity} পিস এবং ${minOrderPrice} টাকার অর্ডার করতে হবে।  )`,
          icon: "warning",
          buttons: "Ok, Understood",
        });
      }

      return false;
    });

    if (!paymentMethod) {
      proceed = false;
      swal({
        title: "Please Select Your Payment Method",
        icon: "warning",
        buttons: "Ok, Understood",
      });
    }

    if (!user.phone) {
      proceed = false;
      swal({
        title: "Please add your phone number first!",
        icon: "warning",
        buttons: "Ok, Understood",
      }).then(function (isConfirm) {
        if (isConfirm) {
          history.push("/dashboard/account");
        }
      });
    }
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
      let cartTotal = summary.totalPrice;

      if (!_.isEmpty(cartConfigured) && !_.isEmpty(shipping_address) && cartTotal && advanced & refNumber) {
        props.confirmCustomerOrder(history, {
          id: auth.shopAsCustomer.id,
          shopAsCustomer: auth.isShopAsCustomer,
          advancePercent: paymentOption,
          pwgDiscount: JSON.stringify({
            discountAmount: discountAmount,
            discountPercent: discountPercent ? discountPercent : 0,
            totalProduct: finalCart.length,
          }),
          paymentMethod: paymentMethod,
          cart: JSON.stringify(finalCart),
          address: JSON.stringify(shipping_address),
          summary: JSON.stringify({
            cartTotal: cartTotal,
            advanced: advanced,
            dueAmount: dueAmount,
            trxId: null,
            couponCode: couponDetails?.coupon_code,
            couponDiscount: couponDiscount,
            refNumber: refNumber.toString(),
          }),
        });
        updateAddStoredCart([], auth.shopAsCustomer.id, auth.isShopAsCustomer);
      } else {
        return;
      }
    }
  };

  return (
    <aside className='col-lg-4'>
      {manageShipping && (
        <ShippingAddress
          currentAddress={shipping_address}
          manageShipping={manageShipping}
          setManageShipping={setManageShipping}
        />
      )}

      <div className='summary summary-cart bim-rl'>
        <h3 className='summary-title text-center bold'>Order Total Summary</h3>

        <div className='text-center'>
          <p className='ship-Text mb-0 p-1'>Select Your First Payment</p>
          <div>
            {checkout_payment_first && (
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name={checkout_payment_first}
                  id={checkout_payment_first}
                  value={checkout_payment_first}
                  onChange={handlePaymentChange}
                  checked={paymentOption === checkout_payment_first}
                />
                <label className='form-check-label' for='inlineRadio1'>
                  {checkout_payment_first}%
                </label>
              </div>
            )}
            {checkout_payment_second && (
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name={checkout_payment_second}
                  id={checkout_payment_second}
                  value={checkout_payment_second}
                  onChange={handlePaymentChange}
                  checked={paymentOption === checkout_payment_second}
                />
                <label className='form-check-label' for='inlineRadio1'>
                  {checkout_payment_second}%
                </label>
              </div>
            )}
            {checkout_payment_third && (
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name={checkout_payment_third}
                  id={checkout_payment_third}
                  value={checkout_payment_third}
                  onChange={handlePaymentChange}
                  checked={paymentOption === checkout_payment_third}
                />
                <label className='form-check-label' for='inlineRadio1'>
                  {checkout_payment_third}%
                </label>
              </div>
            )}
            {checkout_payment_fourth && (
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name={checkout_payment_fourth}
                  id={checkout_payment_fourth}
                  value={checkout_payment_fourth}
                  onChange={handlePaymentChange}
                  checked={paymentOption === checkout_payment_fourth}
                />
                <label className='form-check-label' for='inlineRadio1'>
                  {checkout_payment_fourth}%
                </label>
              </div>
            )}
          </div>
        </div>
        <table className='table table-summary'>
          <tbody>
            <tr className='summary-total'>
              <td>Subtotal:</td>
              <td>{`${currency} ${numberWithCommas(summary.totalPrice)}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>First Pay Total:</td>
              <td>{`${currency} ${numberWithCommas(
                getInitAmountWithoutDiscount(advanced, discountAmount, couponDiscount)
              )}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Due Total:</td>
              <td>{`${currency} ${numberWithCommas(dueAmount)}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Gateway Discount:</td>
              <td>{`${currency} ${numberWithCommas(cartCalculateDiscount(advanced, discountPercent))}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Coupon Reword {coupon_type === "perchantage_discount" ? `(${coupon_amount})` : ""}:</td>
              <td>{`${currency} ${numberWithCommas(couponDiscount)}`}</td>
            </tr>

            <tr className='summary-total'>
              <td>Apply Coupon : </td>
              <td>
                <div className='d-inline-block manage-quantity'>
                  <div className='input-group input-group input-group-sm'>
                    <input
                      placeholder='Enter Coupon'
                      type='text'
                      className='form-control p-2 text-center addQ'
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <div className='input-group-append'>
                      <button
                        onClick={() => handleCouponApply()}
                        type='button'
                        className='btn btn-default'
                        style={{ fontSize: "13.5px" }}
                        disabled={couponDiscount}
                      >
                        {couponDiscount ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className='text-center mt-1'>
          <p className='ship-Text mb-0 p-1'>Choose Payment Method</p>
          <div className='flexBetween align-items-center'>
            <div className='form-check form-check-inline'>
              <input
                className='form-check-input'
                type='radio'
                name='bkash_payment'
                id='bkash_payment'
                value='bkash_payment'
                onChange={handlePaymentMethodChange}
                checked={paymentMethod === "bkash_payment"}
              />
              <label className='form-check-label' for='inlineRadio1'>
                <img src={bakhsImg} alt='' style={{ width: "65px" }} />
              </label>
            </div>

            <div className='form-check form-check-inline'>
              <input
                className='form-check-input'
                type='radio'
                name='nagad_payment'
                id='nagad_payment'
                value='nagad_payment'
                onChange={handlePaymentMethodChange}
                checked={paymentMethod === "nagad_payment"}
              />
              <label className='form-check-label' for='inlineRadio1'>
                <img src={nagadImg} alt='' style={{ width: "65px" }} />
              </label>
            </div>

            <div className='form-check form-check-inline'>
              <input
                className='form-check-input'
                type='radio'
                name='bank_payment'
                id='bank_payment'
                value='bank_payment'
                onChange={handlePaymentMethodChange}
                checked={paymentMethod === "bank_payment"}
              />
              <label className='form-check-label' for='inlineRadio1'>
                <img src={bankImg} alt='' style={{ width: "65px" }} />
              </label>
            </div>

            <div className='form-check form-check-inline'>
              <input
                className='form-check-input'
                type='radio'
                name='cash_payment'
                id='cash_payment'
                value='cash_payment'
                onChange={handlePaymentMethodChange}
                checked={paymentMethod === "cash_payment"}
              />
              <label className='form-check-label' for='inlineRadio1'>
                Cash
              </label>
            </div>
          </div>
        </div>

        <div className='summary-shipping-estimate'>
          <p className='mb-0'>Shipping Address </p>
          <a href={"/shipping"} onClick={(e) => manageShippingAddress(e)} className='small'>
            Choose
          </a>

          <p className='mb-1'>Name: {shipping_address.name || "..."}</p>
          <p className='mb-1'>Phone: {shipping_address.phone_one || "..."}</p>
          <p className='mb-1'>District: {shipping_address.phone_three || "..."}</p>
          <p>{shipping_address.address || ""}</p>
        </div>

        {/* End .table table-summary */}
        <div>
          <div className='pt-2'>
            <button
              type='button'
              onClick={(e) => handlePlaceOrder()}
              className={`btn btn-block btn-check checkout-btn ${place_loading && "disabled"}`}
            >
              {place_loading ? (
                <span>
                  <div className='spinner-border' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                  <span className='mx-2'>PROCESSING</span>
                </span>
              ) : (
                "PLACE ORDER"
              )}
            </button>
          </div>
        </div>
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
  advance_percent: state.CART.advance_percent.advance_percent,
  auth: state.AUTH,
  place_loading: state.LOADING.place_loading,
});

export default connect(mapStateToProps, { confirmCustomerOrder })(withRouter(CheckoutSidebar));
