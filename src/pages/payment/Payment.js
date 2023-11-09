import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { confirmCustomerOrder } from "../../store/actions/CartAction";
import { Link, useHistory, withRouter } from "react-router-dom";
import _ from "lodash";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { getSetting, goPageTop, loadAsset } from "../../utils/Helpers";
import { numberWithCommas } from "../../utils/CartHelpers";
import swal from "sweetalert";

import CopyToClipboard from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import { confirmPayment, getOrderDetails } from "../../utils/Services";

const Payment = (props) => {
  const { match, general, auth } = props;
  const order_id = match.params.id;
  const history = useHistory();
  const [accept, setAccept] = useState("");
  const [trxId, setTrxId] = useState("");
  const [order, setOrder] = useState("");
  const [copy, setCopy] = useState(false);
  const bankId = getSetting(general, "payment_bank_details");

  const currency = getSetting(general, "currency_icon");

  useEffect(() => {
    goPageTop();
    getOrderDetails(order_id, auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setOrder(response.order);
    });
  }, [order_id, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  const onCopy = () => {
    setCopy(true);
  };

  const paymentConfirm = (e) => {
    e.preventDefault();

    let process = true;

    if (!trxId) {
      swal({
        text: "Please Enter Your TRX or Account Number",
        icon: "warning",
        buttons: "Ok, Understood",
      });
      process = false;
    }

    if (!accept) {
      swal({
        text: "Please accept terms and conditions!",
        icon: "warning",
        buttons: "Ok, Understood",
      });
      process = false;
    }

    if (process) {
      if (trxId) {
        confirmPayment(order.id, {
          summary: JSON.stringify({
            trxId: trxId,
          }),
          id: auth.shopAsCustomer.id,
          shopAsCustomer: auth.isShopAsCustomer,
        }).then((response) => {
          if (!_.isEmpty(response)) {
            const resData = response.data;
            if (!_.isEmpty(resData)) {
              if (resData.status === "success") {
                swal({
                  title: `${resData.message}`,
                  icon: "success",
                  buttons: "Ok, Understood",
                  timer: 3000,
                });
                setTimeout(() => {
                  if (resData.redirect) {
                    history.push("/dashboard/pending-orders");
                    // window.location.assign(resData.redirect);
                  }
                }, 2800);
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
      }
    }
  };
  return (
    <main className='main'>
      <Breadcrumb current='Payment' collections={[{ name: "Checkout", url: "checkout" }]} />

      <div className='page-content'>
        <div className='cart'>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-lg-9'>
                <div className='card'>
                  <div className='card-body'>
                    <table className='table table table-cart'>
                      <thead>
                        <tr>
                          <th colSpan={2}>
                            <span>Details</span>
                          </th>
                          <th className='text-center' style={{ width: "10rem" }}>
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tfoot>
                        <tr>
                          <td colSpan={3}>
                            <h3 className='border-0 m-0 py-3 summary-title'>Cart Total Summary</h3>
                          </td>
                        </tr>

                        <tr className='summary-total'>
                          <td colSpan={2} className='text-right'>
                            Subtotal:
                          </td>
                          <td className='text-right'>{`${currency} ${numberWithCommas(order.amount)}`}</td>
                        </tr>

                        <tr className='summary-total'>
                          <td colSpan={2} className='text-right'>
                            Need To Pay:
                          </td>
                          <td className='text-right'>{`${currency} ${numberWithCommas(order.needToPay)}`}</td>
                        </tr>
                        <tr className='summary-total'>
                          <td colSpan={2} className='text-right'>
                            Due Amount:
                          </td>
                          <td className='text-right'>{`${currency} ${numberWithCommas(
                            order.dueForProducts
                          )}`}</td>
                        </tr>
                        {order.pay_method && (
                          <tr>
                            <td colSpan={3} className='p-2'>
                              {order.pay_method == "bkash_payment" && (
                                <img className='qr-code' src={loadAsset(general.qr_code_bkash)} alt='' />
                              )}
                              {order.pay_method == "nagad_payment" && (
                                <img className='qr-code' src={loadAsset(general.qr_code_nagad)} alt='' />
                              )}
                              {order.pay_method == "bank_payment" && (
                                <div className='bankDetails'>
                                  <h3 className='bold text-center bankDetailsText'>
                                    Bank Details: <span className='baseColor'>{bankId}</span>
                                  </h3>
                                  <div>
                                    <CopyToClipboard onCopy={onCopy} text={bankId}>
                                      <button
                                        className='bt copyLink'
                                        style={{
                                          borderRadius: "64px",
                                          width: "80px",
                                          height: "31px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <FaRegCopy />
                                        <span style={{ fontSize: "14px", marginLeft: "0.5rem" }}>
                                          {copy ? "Copied " : "Copy"}
                                        </span>
                                      </button>
                                    </CopyToClipboard>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}

                        <tr className='mt-5 mt-md-0'>
                          <td colSpan={3}>
                            <div>
                              <div className='row'>
                                <div className='col-md-4'>
                                  <label className='bold' htmlFor='TrxId'>
                                    {" "}
                                    Reference Number
                                    <span className='text-danger pt-1 ml-2'>*</span>
                                  </label>
                                </div>
                                <div className='col-md-8'>
                                  <input
                                    className='form-control'
                                    style={{ marginBottom: "0" }}
                                    type='text'
                                    id='refId'
                                    value={order.refNumber}
                                    readOnly
                                  />
                                  <span className='text-danger'>Use this number as payment reference</span>
                                </div>
                              </div>
                              <div className='row mt-1'>
                                <div className='col-md-4'>
                                  <label className='bold' htmlFor='TrxId'>
                                    {" "}
                                    TRX id or Account No
                                    <span className='text-danger pt-1 ml-2'>*</span>
                                  </label>
                                </div>
                                <div className='col-md-8'>
                                  <input
                                    className='form-control'
                                    type='text'
                                    name=''
                                    id='TrxId'
                                    placeholder='TRX id or Account No'
                                    required
                                    onChange={(e) => setTrxId(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={3}>
                            <div className='form-check form-check-inline'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                id='accept'
                                defaultChecked={accept}
                                onChange={() => setAccept(!accept)}
                              />
                              <label className='form-check-label' htmlFor='accept'>
                                <p className='m-0'>
                                  I have read and agree to the website
                                  <Link className='btn-link' to='/pages/privacy-policy'>
                                    Terms and Conditions
                                  </Link>
                                  ,
                                  <Link className='btn-link' to='/pages/privacy-policy'>
                                    Prohibited Items
                                  </Link>{" "}
                                  and
                                  <Link className='btn-link' to='/pages/privacy-policy'>
                                    Refund Policy
                                  </Link>
                                </p>
                              </label>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={3}>
                            <button
                              type='button'
                              onClick={(e) => paymentConfirm(e)}
                              className='btn btn-block btn-default py-3 mt-3'
                            >
                              Confirm Order
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              {/* End .col-lg-9 */}
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </div>
        {/* End .cart */}
      </div>
      {/* End .page-content */}
    </main>
  );
};

Payment.propTypes = {
  general: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  shipping_address: PropTypes.object.isRequired,
  cartConfigured: PropTypes.array.isRequired,
  confirmCustomerOrder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  user: state.AUTH.user,
  auth: state.AUTH,
  cartConfigured: state.CART.configured,
  shipping_address: state.CART.shipping_address,
  advance_percent: state.CART.advance_percent.advance_percent,
  paymentMethod: state.CART.payment_method.payment_method,
  couponDetails: state.CART.couponDetails,
});

export default connect(mapStateToProps, { confirmCustomerOrder })(withRouter(Payment));
