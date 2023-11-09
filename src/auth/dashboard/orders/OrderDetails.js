import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  getSetting,
  goPageTop,
  isAvailableFor2ndPayment,
  isAvailableFor2ndPaymentItem,
  isAvailableForPayment,
  loadAsset,
  useWindowSize,
} from "../../../utils/Helpers";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import { Link, useHistory, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { confirmCustomerOrder } from "../../../store/actions/CartAction";
import { getOrderDetails } from "../../../utils/Services";
import { numberWithCommas } from "../../../utils/CartHelpers";
import { BsPrinterFill, BsArrowDownUp } from "react-icons/bs";

import { useReactToPrint } from "react-to-print";
import LazyImage from "../../../components/common/LazyImage";

const OrderDetails = (props) => {
  const [collapse, setCollapse] = useState(true);
  const { match, general, auth } = props;
  const order_id = match.params.id;
  const [order, setOrder] = useState("");
  const bankId = getSetting(general, "payment_bank_details");
  const currency = getSetting(general, "currency_icon");
  const address = !_.isEmpty(order) ? JSON.parse(order.address) : {};
  const orderItems = !_.isEmpty(order) ? order.order_items : [];
  const site_name = getSetting(general, "site_name");
  const site_url = getSetting(general, "site_url");
  const frontend_logo_menu = getSetting(
    general,
    "frontend_logo_menu",
    "/assets/demos/logo.png"
  );

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  let [width] = useWindowSize();

  useEffect(() => {
    goPageTop();
    setLoading(true);
    getOrderDetails(
      order_id,
      auth.shopAsCustomer.id,
      auth.isShopAsCustomer
    ).then((response) => {
      setLoading(false);
      setOrder(response.order);
    });
  }, [order_id, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  width = width ? width : window.innerWidth;

  let trxIds;
  if (!loading && order) {
    trxIds = JSON.parse(order.trxId);
  }

  const handlePayment = (id) => {
    history.push(`/payment/${id}`);
  };
  const handleItemPayment = (id, itemId) => {
    history.push(`/payment/${id}/${itemId}`);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Order- ${order_id}.pdf`,
  });

  const getCourierBill = () => {
    let courier_bill = 0;
    orderItems.map((item, index) => {
      courier_bill += Number(item.courier_bill ? item.courier_bill : 0);
      return false;
    });
    return courier_bill;
  };
  const getShippingBill = () => {
    let shipping_charge = 0;
    orderItems.map((item, index) => {
      shipping_charge += Number(
        item.shipping_charge ? item.shipping_charge : 0
      );
      return false;
    });
    return shipping_charge;
  };

  const getTotalValue = (totalPrice) => {
    let Total = Number(totalPrice);
    Total += getCourierBill() + getShippingBill();

    return Total;
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
  };
  return (
    <main className="main bg-gray">
      <Breadcrumb
        current="Order details"
        collections={[
          { name: "Dashboard", url: "dashboard" },
          { name: "Orders", url: "dashboard/orders" },
        ]}
      />

      <div className="page-content">
        <div className="container">
          <div className="row justify-content-center">
            <aside className="col-md-10">
              {loading && (
                <div className="text-center">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {!loading && order && (
                <>
                  <div className="card bg-white">
                    <div className="card-body">
                      <div id="exportOrder" ref={componentRef}>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="m-0">
                              <b>CUSTOMER</b>
                            </p>
                            <p className="m-0">
                              Invoice No:#{order.order_number}
                            </p>
                            <p className="m-0">Name: {order.name}</p>
                            <p className="m-0">Email: {order.email}</p>
                            <p className="m-0">Phone: {order.phone || "NA"}</p>
                            <p className="m-0">
                              Address:{" "}
                              {!_.isEmpty(address) ? address.address : ""}
                            </p>
                          </div>
                          <div className="col-md-6 text-md-right">
                            <p className="m-0">
                              <b>
                                {trxIds.payment_2nd
                                  ? "Full Paid"
                                  : trxIds.payment_1st
                                  ? "Initial paid"
                                  : "UNPAID"}
                              </b>
                            </p>
                            <p className="m-0">
                              <span className="mr-2">Method:</span>
                              {order.pay_method === "bkash_payment" && `Bkash`}
                              {order.pay_method === "nagad_payment" && `Nagod`}
                              {order.pay_method === "bank_payment" && `Bank`}
                            </p>
                            <p className="m-0">
                              <span className="mr-2">Wallet:</span>
                              {order.pay_method === "bkash_payment" &&
                                `01811355678`}
                              {order.pay_method === "nagad_payment" &&
                                `01911712769`}
                              {order.pay_method === "bank_payment" &&
                                `${bankId}`}
                            </p>

                            <p className="m-0">
                              Transaction Num (Initial) :{" "}
                              {trxIds.payment_1st || "NA"}
                            </p>
                            <p className="m-0">
                              Transaction Num (Final) :{" "}
                              {trxIds.payment_2nd || "NA"}
                            </p>
                            <p className="m-0">
                              Reference Number : {order.refNumber}
                            </p>
                          </div>
                        </div>
                        <hr />
                        {/* details here */}
                        <div>
                          {orderItems.length > 0 ? (
                            <>
                              {orderItems.map((item, index) => {
                                const item_variations = item.item_variations;
                                return (
                                  <div className="card my-2 hov-shadow ">
                                    <div className="card-header border border-bottom-0 px-2 py-0 py-md-2">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                          <h4 className="bold order-title">
                                            Order No:{item.order_item_number}
                                          </h4>
                                        </div>

                                        <div className="text-right">
                                          <button
                                            onClick={handlePrint}
                                            className="btn btn-default-sm bold"
                                            style={{ marginTop: ".2rem" }}
                                          >
                                            <BsPrinterFill
                                              size={18}
                                              className="mr-2"
                                            />{" "}
                                            Print
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="card-body border px-2 py-0 py-md-1">
                                      <div className="d-flex ">
                                        <div style={{ marginTop: ".8rem" }}>
                                          <Link to={`${item.link}`}>
                                            <LazyImage
                                              classes="oImg"
                                              imageSrc={item.image}
                                              imageAlt={item.name.slice(15)}
                                            />
                                            {/* <img src={item.image} style={{ width: "70px" }} alt='' /> */}
                                          </Link>
                                        </div>
                                        <div className="ml-2">
                                          <Link
                                            to={`${item.link}`}
                                            className="text-secondary text-uppercase"
                                          >
                                            {width >= 768 ? (
                                              <span className="bold">
                                                {item.name}
                                              </span>
                                            ) : (
                                              <span className="bold">
                                                {item.name.slice(0, 45)}...
                                              </span>
                                            )}
                                          </Link>
                                        </div>
                                      </div>

                                      <div className="details py-1 py-md-3">
                                        <div
                                          className={
                                            collapse ? "d-none" : "d-block"
                                          }
                                        >
                                          {item_variations.length > 0 ? (
                                            item_variations.map(
                                              (config, index) => (
                                                <div
                                                  key={index}
                                                  className="row"
                                                  style={{
                                                    borderTop:
                                                      "1px solid lightGray",
                                                  }}
                                                >
                                                  <div className="col-md-5 col-7 Attributes  ">
                                                    {JSON.parse(
                                                      config.attributes
                                                    ).map(
                                                      (Attribute, index3) => (
                                                        <div
                                                          key={index3 + 1}
                                                          className="plain-attribute"
                                                        >
                                                          <b>
                                                            {
                                                              Attribute.PropertyName
                                                            }{" "}
                                                            :
                                                          </b>
                                                          <span>{` ${Attribute.Value}`}</span>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                  <div className="col-md-2 col-5 plain-attribute text-right text-md-left">
                                                    <b>Quantity :</b>
                                                    <span>{`${config.quantity}`}</span>
                                                  </div>

                                                  <div className="col-md-2 col-6 plain-attribute">
                                                    <b>Price :</b>
                                                    <span>
                                                      {currency}{" "}
                                                      {` ${config.price}`}
                                                    </span>
                                                  </div>
                                                  <div className="col-md-3  col-6 plain-attribute text-right ">
                                                    <b>SubTotal :</b>
                                                    <span>
                                                      {" "}
                                                      {currency}{" "}
                                                      {` ${config.subTotal}`}
                                                    </span>
                                                  </div>
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <div
                                              key={index}
                                              className="row"
                                              style={{
                                                borderTop:
                                                  "1px solid lightGray",
                                              }}
                                            >
                                              <div className="col-md-4 col-6 plain-attribute text-left">
                                                <b>Quantity :</b>
                                                <span>{item.quantity}</span>
                                              </div>

                                              <div className="col-md-4 col-6 plain-attribute text-right">
                                                <b>Price :</b>
                                                <span>
                                                  {Number(item.product_value) /
                                                    Number(item.quantity)}
                                                </span>
                                              </div>
                                              <div className="col-md-4  col-12 plain-attribute text-right ">
                                                <b>SubTotal :</b>
                                                <span>
                                                  {currency}{" "}
                                                  {numberWithCommas(
                                                    item.product_value
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                          <div
                                            className="row"
                                            style={{
                                              borderTop: "1px solid lightGray",
                                            }}
                                          >
                                            <div className="col-6">
                                              <b>China Local Delivery (+) : </b>
                                              <span>
                                                {currency}{" "}
                                                {numberWithCommas(
                                                  item.chinaLocalDelivery
                                                )}
                                              </span>
                                            </div>
                                            <div className="col-6 text-right">
                                              <b> SubTotal/Product Value :</b>
                                              <span>
                                                {currency}{" "}
                                                {numberWithCommas(
                                                  Number(item.product_value)
                                                )}
                                              </span>
                                            </div>
                                          </div>

                                          <div
                                            className="row"
                                            style={{
                                              borderTop: "1px solid lightGray",
                                            }}
                                          >
                                            <div className="col-4">
                                              <b>Coupon : </b>
                                              <span>
                                                {currency}{" "}
                                                {numberWithCommas(
                                                  item.coupon_contribution
                                                )}{" "}
                                                tk
                                              </span>
                                            </div>
                                            <div className="col-4 text-right">
                                              <b>discount :</b>
                                              <span>
                                                {currency}{" "}
                                                {numberWithCommas(
                                                  item.discount
                                                )}{" "}
                                              </span>
                                            </div>
                                            <div className="col-4 text-right">
                                              <b>Total discount (-):</b>
                                              <span>
                                                {currency}{" "}
                                                {numberWithCommas(
                                                  Number(
                                                    item.coupon_contribution
                                                  ) + Number(item.discount)
                                                )}
                                              </span>
                                            </div>
                                          </div>

                                          <div
                                            className="row"
                                            style={{
                                              borderTop: "1px solid lightGray",
                                            }}
                                          >
                                            <div className="col-12 text-right">
                                              <b>Product DUE:</b>
                                              <span>
                                                {currency}{" "}
                                                {numberWithCommas(
                                                  Number(item.product_value) -
                                                    Number(
                                                      item.coupon_contribution
                                                    ) +
                                                    Number(item.discount)
                                                )}
                                              </span>
                                            </div>
                                          </div>

                                          <div
                                            className="row"
                                            style={{
                                              borderTop: "1px solid lightGray",
                                            }}
                                          >
                                            <div className="col-12 text-right">
                                              <span>
                                                <b> Shipping Per KG</b> (Total
                                                Weight({item.actual_weight}) *
                                                Shipping Fee ({currency}{" "}
                                                {item.shipping_rate})) <b>:</b>
                                              </span>

                                              <span>
                                                {numberWithCommas(
                                                  item.shipping_charge
                                                )}
                                              </span>
                                            </div>
                                          </div>

                                          <p className="text-right due-Text">
                                            <b> NET PRODUCT PRICE : </b>
                                            <span>
                                              {currency}
                                              {numberWithCommas(
                                                Number(item.product_value) -
                                                  Number(
                                                    item.coupon_contribution
                                                  ) +
                                                  Number(item.discount)
                                              )}
                                            </span>
                                          </p>
                                        </div>
                                        <div>
                                          <button
                                            className="btn expand btn-default btn-block bold"
                                            type="button"
                                            onClick={handleCollapse}
                                          >
                                            <span>
                                              <BsArrowDownUp
                                                size={20}
                                                className="mr-2"
                                              />
                                            </span>
                                            DETAILS
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="card my-2">
                          <div className="card-header border border-bottom-0 px-2 py-0 py-md-2">
                            <p className="bold  baseColor text-uppercase pb-0 mb-0">
                              Order summary
                            </p>
                          </div>
                          <div className="card-body border px-2 py-0 py-md-4">
                            <div className="text-right">
                              <p>
                                <b>Total Product Price : </b>{" "}
                                {`${currency} ${numberWithCommas(
                                  order.amount
                                )}`}
                              </p>
                              <p>
                                <b> Shipping + Courier : </b>
                                {`${currency} ${numberWithCommas(
                                  getCourierBill() + getShippingBill()
                                )}`}
                              </p>
                              <p>
                                <b>Subtotal : </b>
                                {`${currency} ${numberWithCommas(
                                  getTotalValue(order.amount)
                                )}`}
                              </p>
                              <p>
                                <b>Initial Payment : </b>
                                {`${currency} ${numberWithCommas(
                                  order.needToPay
                                )}`}
                              </p>
                              <p>
                                <b>Final Payment : </b>
                                {`${currency} ${numberWithCommas(
                                  getTotalValue(order.dueForProducts)
                                )}`}
                              </p>
                              <div className="text-right">
                                {trxIds.payment_2nd ? (
                                  "Paid"
                                ) : trxIds.payment_1st ? (
                                  <button
                                    onClick={() => handlePayment(order.id)}
                                    className="btn btn-default"
                                    disabled={isAvailableFor2ndPayment(order)}
                                  >
                                    Full pay
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handlePayment(order.id)}
                                    className="btn btn-default"
                                    disabled={isAvailableForPayment(order)}
                                  >
                                    Pay now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="t-middle baseColor">
                            <b>শিপিং চার্জ পণ্য আসার পর যোগ হবে।</b>
                          </p>
                        </div>
                        <div className="flexBetween align-items-center">
                          <div className="logo">
                            <img
                              src={loadAsset(frontend_logo_menu)}
                              alt={site_name}
                            />
                          </div>
                          <div>
                            <a href={site_url}>{site_url}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flexCenter pt-2">
                    <button
                      className="btn btn-default-outline"
                      style={{ fontWeight: "bold" }}
                      onClick={handlePrint}
                    >
                      Download/Print invoice <i className="icon-arrow-down"></i>
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </div>
    </main>
  );
};

OrderDetails.propTypes = {
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
});

export default connect(mapStateToProps, { confirmCustomerOrder })(
  withRouter(OrderDetails)
);
